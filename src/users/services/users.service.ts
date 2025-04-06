/**
 * File: users.service.ts
 * Mô tả: Service xử lý logic nghiệp vụ liên quan đến người dùng
 *
 * Chức năng:
 * - Cung cấp các phương thức CRUD cho entity User
 * - Xử lý các nghiệp vụ như mã hóa mật khẩu, kiểm tra trùng lặp username/email
 * - Tương tác với database thông qua TypeORM Repository
 */

import {
  Injectable, // Decorator đánh dấu class là service có thể inject
  NotFoundException, // Exception khi không tìm thấy tài nguyên
  ConflictException, // Exception khi xảy ra xung đột dữ liệu
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Decorator để inject repository
import { Repository, DataSource } from 'typeorm'; // Class Repository của TypeORM
import * as bcrypt from 'bcrypt'; // Thư viện mã hóa mật khẩu
import { User } from '../entities/user.entity'; // Entity User
import { CreateUserDto } from '../dtos/create-user.dto'; // DTO cho tạo người dùng
import { UpdateUserDto } from '../dtos/update-user.dto'; // DTO cho cập nhật người dùng
import { Role } from '../entities/role.entity'; // Entity Role
import { OrdersService } from '@/orders/services/orders.service'; // Service Orders
import { AccessToken } from '@/auth/entities/access-token.entity'; // Entity AccessToken
import { RefreshToken } from '@/auth/entities/refresh-token.entity'; // Entity RefreshToken

@Injectable() // Đánh dấu class là một provider có thể inject
export class UsersService {
  constructor(
    @InjectRepository(User) // Inject Repository của entity User
    private readonly usersRepository: Repository<User>, // Repository để tương tác với bảng users
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Lấy danh sách người dùng với phân trang
   * @param page Trang hiện tại
   * @param limit Số lượng người dùng mỗi trang
   * @returns Danh sách người dùng và tổng số người dùng
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: User[]; total: number }> {
    // Tìm danh sách người dùng và đếm tổng số
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit, // Bỏ qua các bản ghi của các trang trước
      take: limit, // Lấy số lượng bản ghi theo limit
      select: [
        'user_id',
        'username',
        'email',
        'first_name',
        'last_name',
        'full_name',
        'is_active',
        'created_at',
      ], // Chỉ chọn các trường cần thiết (không lấy password_hash)
    });

    return { data, total };
  }

  /**
   * Tìm người dùng theo ID
   * @param id ID của người dùng
   * @returns Thông tin chi tiết người dùng
   * @throws NotFoundException nếu không tìm thấy người dùng
   */
  async findOne(id: number): Promise<User> {
    // Tìm người dùng theo ID và lấy thêm thông tin về roles
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['roles'], // Lấy thêm thông tin về roles (quan hệ n-n)
    });

    // Nếu không tìm thấy, ném exception
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Tìm người dùng theo username
   * @param username Username của người dùng
   * @returns Thông tin chi tiết người dùng
   * @throws NotFoundException nếu không tìm thấy người dùng
   */
  async findByUsername(username: string): Promise<User> {
    // Tìm người dùng theo username và lấy thêm thông tin về roles
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['roles'], // Lấy thêm thông tin về roles (quan hệ n-n)
    });

    // Nếu không tìm thấy, ném exception
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  /**
   * Tìm người dùng theo email
   * @param email Email của người dùng
   * @returns Thông tin chi tiết người dùng hoặc null nếu không tìm thấy
   */
  async findByEmail(email: string): Promise<User> {
    // Tìm người dùng theo email và lấy thêm thông tin về roles
    const user = (await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'], // Lấy thêm thông tin về roles (quan hệ n-n)
    })) as User;
    return user;
  }

  /**
   * Tạo người dùng mới
   * @param createUserDto Dữ liệu người dùng mới
   * @returns Thông tin người dùng đã tạo
   * @throws ConflictException nếu username hoặc email đã tồn tại
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Kiểm tra nếu username hoặc email đã tồn tại
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    // Nếu đã tồn tại, ném exception
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(); // Tạo salt
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt); // Mã hóa mật khẩu

    // Tạo đối tượng User mới
    const user = this.usersRepository.create({
      ...createUserDto, // Spread toàn bộ thuộc tính từ DTO
      password_hash: hashedPassword, // Lưu mật khẩu đã mã hóa
    });

    // Lưu vào database
    return this.usersRepository.save(user);
  }

  /**
   * Cập nhật thông tin người dùng
   * @param id ID của người dùng
   * @param updateUserDto Dữ liệu cập nhật
   * @returns Thông tin người dùng đã cập nhật
   * @throws NotFoundException nếu không tìm thấy người dùng
   * @throws ConflictException nếu username hoặc email đã tồn tại
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Tìm người dùng theo ID
    const user = await this.findOne(id);

    // Kiểm tra nếu đổi username và username mới đã tồn tại
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Kiểm tra nếu đổi email và email mới đã tồn tại
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Nếu cập nhật mật khẩu, mã hóa mật khẩu mới
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(); // Tạo salt
      user.password_hash = await bcrypt.hash(updateUserDto.password, salt); // Mã hóa mật khẩu
      delete updateUserDto.password; // Xóa mật khẩu khỏi DTO để không bị ghi đè
    }

    // Cập nhật các trường khác
    Object.assign(user, updateUserDto);

    // Lưu vào database
    return this.usersRepository.save(user);
  }

  /**
   * Xóa người dùng
   * @param id ID của người dùng
   * @throws NotFoundException nếu không tìm thấy người dùng
   */
  async remove(id: number): Promise<void> {
    // Tìm người dùng theo ID
    const user = await this.findOne(id);

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    await this.dataSource.transaction(async (manager) => {
      // Xóa tất cả access tokens của người dùng
      await manager.delete(AccessToken, { user_id: id });

      // Xóa tất cả refresh tokens của người dùng
      await manager.delete(RefreshToken, { user_id: id });

      // Xóa các bản ghi liên quan khác nếu cần
      // VD: Xóa orders, comments, reviews, cart items, etc.

      // Cuối cùng xóa người dùng
      await manager.remove(user);
    });
  }
}
