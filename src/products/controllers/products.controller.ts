/**
 * File: products.controller.ts
 * Mô tả: Controller xử lý các request liên quan đến sản phẩm
 *
 * Chức năng:
 * - Xử lý các API endpoint cho quản lý sản phẩm
 * - Cung cấp các route để lấy danh sách, chi tiết, tạo mới, cập nhật và xóa sản phẩm
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

/**
 * Controller quản lý sản phẩm - Không yêu cầu xác thực JWT
 */
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Lấy danh sách sản phẩm với phân trang
   * @param page Trang hiện tại (mặc định: 1)
   * @param limit Số lượng sản phẩm mỗi trang (mặc định: 10)
   * @returns Danh sách sản phẩm và tổng số sản phẩm
   */
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng sản phẩm mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách sản phẩm với phân trang',
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.productsService.findAll(+page, +limit);
  }

  /**
   * Lấy thông tin chi tiết sản phẩm theo ID
   * @param id ID của sản phẩm
   * @returns Thông tin chi tiết sản phẩm
   */
  @ApiOperation({ summary: 'Lấy thông tin chi tiết sản phẩm theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin chi tiết sản phẩm',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * Tìm kiếm sản phẩm
   * @param searchTerm Từ khóa tìm kiếm
   * @param page Trang hiện tại
   * @param limit Số lượng sản phẩm mỗi trang
   * @returns Danh sách sản phẩm và tổng số sản phẩm
   */
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
  @ApiQuery({ name: 'term', required: true, description: 'Từ khóa tìm kiếm' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng sản phẩm mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách sản phẩm phù hợp với từ khóa',
  })
  @Get('search')
  async search(
    @Query('term') searchTerm: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.productsService.search(searchTerm, +page, +limit);
  }

  /**
   * Tạo sản phẩm mới
   * @param createProductDto Dữ liệu sản phẩm mới
   * @returns Thông tin sản phẩm đã tạo
   */
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Sản phẩm đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 409,
    description: 'SKU đã tồn tại',
  })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Cập nhật thông tin sản phẩm
   * @param id ID sản phẩm
   * @param updateProductDto Dữ liệu cập nhật
   * @returns Thông tin sản phẩm đã cập nhật
   */
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: 'number' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Sản phẩm đã được cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ApiResponse({
    status: 409,
    description: 'SKU đã tồn tại',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Xóa sản phẩm
   * @param id ID sản phẩm
   * @returns Thông báo xóa thành công
   */
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}
