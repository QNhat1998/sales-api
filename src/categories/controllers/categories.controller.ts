/**
 * File: categories.controller.ts
 * Mô tả: Controller xử lý các request liên quan đến danh mục sản phẩm
 *
 * Chức năng:
 * - Xử lý các API endpoint cho quản lý danh mục sản phẩm
 * - Cung cấp các route để lấy danh sách và chi tiết danh mục
 */

import {
  Controller, // Decorator đánh dấu class là controller
  Get, // Decorator cho HTTP GET request
  Post, // Decorator cho HTTP POST request
  Body, // Decorator để truy cập body của request
  Param, // Decorator để truy cập parameter từ URL
  Put, // Decorator cho HTTP PUT request
  Delete, // Decorator cho HTTP DELETE request
  Query, // Decorator để truy cập query string
  ParseIntPipe, // Pipe để chuyển đổi string thành integer
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service'; // Service xử lý logic danh mục
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

/**
 * Controller quản lý danh mục - Không yêu cầu xác thực JWT
 */
@ApiTags('categories')
@Controller('categories') // Đường dẫn prefix cho các route trong controller
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {} // Inject CategoriesService

  /**
   * Lấy danh sách danh mục với phân trang
   * @param page Trang hiện tại (mặc định: 1)
   * @param limit Số lượng danh mục mỗi trang (mặc định: 10)
   * @returns Danh sách danh mục và tổng số danh mục
   */
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng danh mục mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách danh mục với phân trang',
  })
  @Get() // HTTP GET request tới /categories
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    // Lấy tất cả danh mục với phân trang
    return this.categoriesService.findAll(+page, +limit);
  }

  /**
   * Lấy thông tin chi tiết danh mục theo ID
   * @param id ID của danh mục
   * @returns Thông tin chi tiết danh mục
   */
  @ApiOperation({ summary: 'Lấy thông tin chi tiết danh mục theo ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin chi tiết danh mục',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @Get(':id') // HTTP GET request tới /categories/:id
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // Lấy thông tin danh mục theo ID
    return this.categoriesService.findOne(id);
  }

  /**
   * Tạo danh mục mới
   * @param createCategoryDto Dữ liệu danh mục mới
   * @returns Thông tin danh mục đã tạo
   */
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Danh mục đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên danh mục đã tồn tại',
  })
  @Post() // HTTP POST request tới /categories
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Cập nhật thông tin danh mục
   * @param id ID danh mục
   * @param updateCategoryDto Dữ liệu cập nhật
   * @returns Thông tin danh mục đã cập nhật
   */
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục', type: 'number' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Danh mục đã được cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @ApiResponse({
    status: 409,
    description: 'Tên danh mục đã tồn tại',
  })
  @Put(':id') // HTTP PUT request tới /categories/:id
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Xóa danh mục
   * @param id ID danh mục
   * @returns Thông báo xóa thành công
   */
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục', type: 'number' })
  @ApiResponse({ status: 200, description: 'Danh mục đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @Delete(':id') // HTTP DELETE request tới /categories/:id
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
