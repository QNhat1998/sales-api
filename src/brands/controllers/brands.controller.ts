/**
 * File: brands.controller.ts
 * Mô tả: Controller xử lý các request liên quan đến thương hiệu sản phẩm
 *
 * Chức năng:
 * - Xử lý các API endpoint cho quản lý thương hiệu sản phẩm
 * - Cung cấp các route để lấy danh sách và chi tiết thương hiệu
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { CreateBrandDto } from '../dtos/create-brand.dto';
import { UpdateBrandDto } from '../dtos/update-brand.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

/**
 * Controller quản lý thương hiệu - Không yêu cầu xác thực JWT
 */
@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  /**
   * Lấy danh sách thương hiệu với phân trang
   * @param page Trang hiện tại (mặc định: 1)
   * @param limit Số lượng thương hiệu mỗi trang (mặc định: 10)
   * @returns Danh sách thương hiệu và tổng số thương hiệu
   */
  @ApiOperation({ summary: 'Lấy danh sách thương hiệu' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng thương hiệu mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách thương hiệu với phân trang',
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.brandsService.findAll(+page, +limit);
  }

  /**
   * Lấy thông tin chi tiết thương hiệu theo ID
   * @param id ID của thương hiệu
   * @returns Thông tin chi tiết thương hiệu
   */
  @ApiOperation({ summary: 'Lấy thông tin chi tiết thương hiệu theo ID' })
  @ApiParam({ name: 'id', description: 'ID của thương hiệu', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin chi tiết thương hiệu',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thương hiệu' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  /**
   * Tạo thương hiệu mới
   * @param createBrandDto Dữ liệu thương hiệu mới
   * @returns Thông tin thương hiệu đã tạo
   */
  @ApiOperation({ summary: 'Tạo thương hiệu mới' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Thương hiệu đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên thương hiệu đã tồn tại',
  })
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  /**
   * Cập nhật thông tin thương hiệu
   * @param id ID thương hiệu
   * @param updateBrandDto Dữ liệu cập nhật
   * @returns Thông tin thương hiệu đã cập nhật
   */
  @ApiOperation({ summary: 'Cập nhật thông tin thương hiệu' })
  @ApiParam({ name: 'id', description: 'ID của thương hiệu', type: 'number' })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: 200,
    description: 'Thương hiệu đã được cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thương hiệu' })
  @ApiResponse({
    status: 409,
    description: 'Tên thương hiệu đã tồn tại',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  /**
   * Xóa thương hiệu
   * @param id ID thương hiệu
   * @returns Thông báo xóa thành công
   */
  @ApiOperation({ summary: 'Xóa thương hiệu' })
  @ApiParam({ name: 'id', description: 'ID của thương hiệu', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Thương hiệu đã được xóa thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thương hiệu' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.brandsService.remove(id);
    return { message: 'Brand deleted successfully' };
  }
}
