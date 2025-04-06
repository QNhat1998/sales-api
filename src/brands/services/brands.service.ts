import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from '../dtos/create-brand.dto';
import { UpdateBrandDto } from '../dtos/update-brand.dto';

/**
 * Service quản lý thương hiệu
 */
@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  /**
   * Lấy danh sách thương hiệu
   * @param page Trang hiện tại
   * @param limit Số lượng thương hiệu mỗi trang
   * @returns Danh sách thương hiệu và tổng số thương hiệu
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Brand[]; total: number }> {
    const [data, total] = await this.brandsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  /**
   * Lấy thông tin chi tiết thương hiệu theo ID
   * @param id ID thương hiệu
   * @returns Thông tin chi tiết thương hiệu
   */
  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { brand_id: id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  /**
   * Tạo thương hiệu mới
   * @param createBrandDto Dữ liệu thương hiệu mới
   * @returns Thông tin thương hiệu đã tạo
   */
  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    // Kiểm tra xem tên thương hiệu đã tồn tại chưa
    const existingBrand = await this.brandsRepository.findOne({
      where: { brand_name: createBrandDto.brand_name },
    });

    if (existingBrand) {
      throw new ConflictException(
        `Brand with name '${createBrandDto.brand_name}' already exists`,
      );
    }

    // Tạo thương hiệu mới
    const brand = this.brandsRepository.create(createBrandDto);

    // Lưu vào database
    return this.brandsRepository.save(brand);
  }

  /**
   * Cập nhật thông tin thương hiệu
   * @param id ID của thương hiệu
   * @param updateBrandDto Dữ liệu cập nhật
   * @returns Thông tin thương hiệu đã cập nhật
   */
  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    // Tìm thương hiệu theo ID
    const brand = await this.findOne(id);

    // Kiểm tra nếu đổi tên thương hiệu và tên mới đã tồn tại
    if (
      updateBrandDto.brand_name &&
      updateBrandDto.brand_name !== brand.brand_name
    ) {
      const existingBrand = await this.brandsRepository.findOne({
        where: { brand_name: updateBrandDto.brand_name },
      });

      if (existingBrand) {
        throw new ConflictException(
          `Brand with name '${updateBrandDto.brand_name}' already exists`,
        );
      }
    }

    // Cập nhật các trường
    Object.assign(brand, updateBrandDto);

    // Lưu vào database
    return this.brandsRepository.save(brand);
  }

  /**
   * Xóa thương hiệu
   * @param id ID của thương hiệu
   */
  async remove(id: number): Promise<void> {
    // Tìm thương hiệu theo ID
    const brand = await this.findOne(id);

    // Xóa thương hiệu
    await this.brandsRepository.remove(brand);
  }
}
