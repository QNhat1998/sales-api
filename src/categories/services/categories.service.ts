/**
 * File: categories.service.ts
 * Mô tả: Service xử lý logic nghiệp vụ liên quan đến danh mục sản phẩm
 *
 * Chức năng:
 * - Cung cấp các phương thức truy xuất dữ liệu danh mục
 * - Xử lý logic lấy danh sách và chi tiết danh mục
 * - Tương tác với database thông qua TypeORM Repository
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'; // Exception và decorator
import { InjectRepository } from '@nestjs/typeorm'; // Decorator để inject repository
import { Repository } from 'typeorm'; // Class Repository của TypeORM
import { Category } from '../entities/category.entity'; // Entity Category
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable() // Đánh dấu class là một provider có thể inject
export class CategoriesService {
  constructor(
    @InjectRepository(Category) // Inject Repository của entity Category
    private readonly categoriesRepository: Repository<Category>, // Repository để tương tác với bảng categories
  ) {}

  /**
   * Lấy danh sách danh mục với phân trang
   * @param page Trang hiện tại (mặc định: 1)
   * @param limit Số lượng danh mục mỗi trang (mặc định: 10)
   * @returns Danh sách danh mục và tổng số danh mục
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Category[]; total: number }> {
    // Tìm danh sách danh mục và đếm tổng số
    const [data, total] = await this.categoriesRepository.findAndCount({
      skip: (page - 1) * limit, // Bỏ qua các bản ghi của các trang trước
      take: limit, // Lấy số lượng bản ghi theo limit
    });

    return { data, total };
  }

  /**
   * Lấy thông tin chi tiết danh mục theo ID
   * @param id ID của danh mục
   * @returns Thông tin chi tiết danh mục và các sản phẩm liên quan
   * @throws NotFoundException nếu không tìm thấy danh mục
   */
  async findOne(id: number): Promise<Category> {
    // Tìm danh mục theo ID và lấy thêm thông tin về sản phẩm
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id }, // Điều kiện tìm kiếm theo ID
      relations: ['products'], // Lấy thêm thông tin về sản phẩm (quan hệ 1-n)
    });

    // Nếu không tìm thấy, ném exception
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Tạo danh mục mới
   * @param createCategoryDto Dữ liệu danh mục mới
   * @returns Thông tin danh mục đã tạo
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Kiểm tra xem tên danh mục đã tồn tại chưa
    const existingCategory = await this.categoriesRepository.findOne({
      where: { category_name: createCategoryDto.category_name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name '${createCategoryDto.category_name}' already exists`,
      );
    }

    // Tạo danh mục mới
    const category = this.categoriesRepository.create(createCategoryDto);

    // Lưu vào database
    return this.categoriesRepository.save(category);
  }

  /**
   * Cập nhật thông tin danh mục
   * @param id ID của danh mục
   * @param updateCategoryDto Dữ liệu cập nhật
   * @returns Thông tin danh mục đã cập nhật
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Tìm danh mục theo ID
    const category = await this.findOne(id);

    // Kiểm tra nếu đổi tên danh mục và tên mới đã tồn tại
    if (
      updateCategoryDto.category_name &&
      updateCategoryDto.category_name !== category.category_name
    ) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { category_name: updateCategoryDto.category_name },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name '${updateCategoryDto.category_name}' already exists`,
        );
      }
    }

    // Cập nhật các trường
    Object.assign(category, updateCategoryDto);

    // Lưu vào database
    return this.categoriesRepository.save(category);
  }

  /**
   * Xóa danh mục
   * @param id ID của danh mục
   */
  async remove(id: number): Promise<void> {
    // Tìm danh mục theo ID
    const category = await this.findOne(id);

    // Xóa danh mục
    await this.categoriesRepository.remove(category);
  }
}
