/**
 * File: users.controller.ts
 * Mô tả: Controller xử lý các request liên quan đến người dùng
 *
 * Chức năng:
 * - Xử lý các API endpoint cho quản lý người dùng
 * - Cung cấp các route CRUD cho entity User
 * - Bảo vệ các endpoint bằng JWT Authentication
 * - Tài liệu hóa API với Swagger
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
  UseGuards, // Decorator để sử dụng guard bảo vệ route
  ParseIntPipe, // Pipe để chuyển đổi string thành integer
} from '@nestjs/common';
import {
  ApiBearerAuth, // Decorator để đánh dấu endpoint yêu cầu xác thực bearer token
  ApiTags, // Decorator để nhóm các endpoint trong Swagger
  ApiOperation, // Decorator để mô tả hoạt động của endpoint
  ApiResponse, // Decorator để mô tả response của endpoint
  ApiParam, // Decorator để mô tả parameter của endpoint
  ApiQuery, // Decorator để mô tả query parameter của endpoint
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; // Guard bảo vệ route bằng JWT
import { UsersService } from '../services/users.service'; // Service xử lý logic người dùng
import { CreateUserDto } from '../dtos/create-user.dto'; // DTO cho tạo người dùng
import { UpdateUserDto } from '../dtos/update-user.dto'; // DTO cho cập nhật người dùng
import { User } from '../entities/user.entity'; // Entity User
import { OrdersService } from '@/orders/services/orders.service'; // Import OrdersService để lấy đơn hàng

@ApiTags('users') // Nhóm các endpoint dưới tag 'users' trong Swagger
@ApiBearerAuth('JWT-auth') // Yêu cầu JWT token để truy cập các endpoint
@Controller('users') // Đường dẫn prefix cho các route trong controller
@UseGuards(JwtAuthGuard) // Áp dụng JwtAuthGuard để bảo vệ tất cả các route
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // Inject UsersService
    private readonly ordersService: OrdersService, // Inject OrdersService
  ) {}

  @ApiOperation({ summary: 'Lấy danh sách người dùng' }) // Mô tả hoạt động trong Swagger
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  }) // Mô tả query param 'page'
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng người dùng mỗi trang (mặc định: 10)',
  }) // Mô tả query param 'limit'
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách người dùng với phân trang',
  }) // Mô tả response thành công
  @Get() // HTTP GET request tới /users
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    // Lấy tất cả người dùng với phân trang
    return this.usersService.findAll(+page, +limit);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng theo ID' }) // Mô tả hoạt động trong Swagger
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: 'number' }) // Mô tả parameter 'id'
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin chi tiết người dùng',
  }) // Mô tả response thành công
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' }) // Mô tả response lỗi
  @Get(':id') // HTTP GET request tới /users/:id
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // Lấy thông tin người dùng theo ID
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Tạo người dùng mới' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' }) // Mô tả response thành công
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // Mô tả response lỗi
  @ApiResponse({ status: 409, description: 'Username hoặc email đã tồn tại' }) // Mô tả response lỗi
  @Post() // HTTP POST request tới /users
  async create(@Body() createUserDto: CreateUserDto) {
    // Tạo người dùng mới
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' }) // Mô tả hoạt động trong Swagger
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: 'number' }) // Mô tả parameter 'id'
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công' }) // Mô tả response thành công
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // Mô tả response lỗi
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' }) // Mô tả response lỗi
  @ApiResponse({ status: 409, description: 'Username hoặc email đã tồn tại' }) // Mô tả response lỗi
  @Put(':id') // HTTP PUT request tới /users/:id
  async update(
    @Param('id', ParseIntPipe) id: number, // Lấy ID từ URL param và convert sang number
    @Body() updateUserDto: UpdateUserDto, // Lấy dữ liệu từ request body
  ) {
    // Cập nhật thông tin người dùng
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Xóa người dùng' }) // Mô tả hoạt động trong Swagger
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: 'number' }) // Mô tả parameter 'id'
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' }) // Mô tả response thành công
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' }) // Mô tả response lỗi
  @Delete(':id') // HTTP DELETE request tới /users/:id
  async remove(@Param('id', ParseIntPipe) id: number) {
    // Xóa người dùng theo ID
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @ApiOperation({ summary: 'Lấy đơn hàng của người dùng' }) // Mô tả hoạt động trong Swagger
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: 'number' }) // Mô tả parameter 'id'
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  }) // Mô tả query param 'page'
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng đơn hàng mỗi trang (mặc định: 10)',
  }) // Mô tả query param 'limit'
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách đơn hàng của người dùng',
  }) // Mô tả response thành công
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' }) // Mô tả response lỗi
  @Get(':id/orders') // HTTP GET request tới /users/:id/orders
  async getUserOrders(
    @Param('id', ParseIntPipe) id: number, // Lấy ID từ URL param và convert sang number
    @Query('page') page = 1, // Lấy page từ query string, mặc định là 1
    @Query('limit') limit = 10, // Lấy limit từ query string, mặc định là 10
  ) {
    // Lấy danh sách đơn hàng của người dùng từ OrdersService
    return this.ordersService.findByUserId(id, +page, +limit);
  }
}
