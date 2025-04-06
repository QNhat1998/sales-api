/**
 * File: auth.controller.ts
 * Mô tả: Controller xử lý các request liên quan đến xác thực người dùng
 *
 * Chức năng:
 * - Xử lý các API endpoint cho đăng nhập, đăng xuất, đăng ký
 * - Quản lý token (làm mới token)
 * - Lấy thông tin profile người dùng đang đăng nhập
 * - Tài liệu hóa API với Swagger
 */

import {
  Controller, // Decorator đánh dấu class là controller
  Post, // Decorator cho HTTP POST request
  Body, // Decorator để truy cập body của request
  UseGuards, // Decorator để sử dụng guard bảo vệ route
  Request, // Decorator để truy cập request object
  Get, // Decorator cho HTTP GET request
  UnauthorizedException, // Exception khi không có quyền truy cập
  HttpCode, // Decorator để đặt HTTP status code cho response
} from '@nestjs/common';
import {
  ApiTags, // Decorator để nhóm các endpoint trong Swagger
  ApiOperation, // Decorator để mô tả hoạt động của endpoint
  ApiResponse, // Decorator để mô tả response của endpoint
  ApiBearerAuth, // Decorator để đánh dấu endpoint yêu cầu xác thực bearer token
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service'; // Import service xác thực
import { LoginDto } from '../dtos/login.dto'; // DTO cho đăng nhập
import { RefreshTokenDto } from '../dtos/refresh-token.dto'; // DTO cho làm mới token
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Guard bảo vệ route bằng JWT
import { LocalAuthGuard } from '../guards/local-auth.guard'; // Guard xác thực local
import { SignupDto } from '../dtos/signup.dto'; // DTO cho đăng ký

@ApiTags('auth') // Nhóm các endpoint dưới tag 'auth' trong Swagger
@Controller('auth') // Đường dẫn prefix cho các route trong controller
export class AuthController {
  constructor(private readonly authService: AuthService) {} // Inject AuthService

  @ApiOperation({ summary: 'Đăng nhập hệ thống' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về token và thông tin người dùng',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          },
        },
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  }) // Mô tả response thành công
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập không hợp lệ' }) // Mô tả response lỗi
  @Post('login') // HTTP POST request tới /auth/login
  @HttpCode(200) // hoặc bỏ hẳn decorator nếu mặc định là 200
  async login(@Body() loginDto: LoginDto) {
    // Xử lý đăng nhập với username/email và password
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  }) // Mô tả response thành công
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc không được cung cấp',
  }) // Mô tả response lỗi
  @ApiBearerAuth('JWT-auth') // Yêu cầu JWT token để truy cập endpoint
  @UseGuards(JwtAuthGuard) // Bảo vệ route bằng JwtAuthGuard
  @Post('logout') // HTTP POST request tới /auth/logout
  async logout(@Request() req) {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Xử lý đăng xuất bằng cách vô hiệu hóa token
    await this.authService.logout(req.user.userId, token);

    return {
      message: 'Logged out successfully',
    };
  }

  @ApiOperation({ summary: 'Làm mới token' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({
    status: 200,
    description: 'Token được làm mới thành công',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  }) // Mô tả response thành công
  @ApiResponse({
    status: 401,
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Refresh token expired' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  }) // Mô tả response lỗi
  @Post('refresh') // HTTP POST request tới /auth/refresh
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    // Xử lý làm mới token bằng refresh token
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng đang đăng nhập',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        username: { type: 'string' },
      },
    },
  }) // Mô tả response thành công
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  }) // Mô tả response lỗi
  @ApiBearerAuth('JWT-auth') // Yêu cầu JWT token để truy cập endpoint
  @UseGuards(JwtAuthGuard) // Bảo vệ route bằng JwtAuthGuard
  @Get('profile') // HTTP GET request tới /auth/profile
  getProfile(@Request() req) {
    // Trả về thông tin người dùng từ request (đã được giải mã từ token bởi JwtAuthGuard)
    return req.user;
  }

  @ApiOperation({ summary: 'Đăng ký tài khoản mới' }) // Mô tả hoạt động trong Swagger
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công, trả về token và thông tin người dùng',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          },
        },
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  }) // Mô tả response thành công
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // Mô tả response lỗi
  @ApiResponse({ status: 409, description: 'Username hoặc email đã tồn tại' }) // Mô tả response lỗi
  @Post('signup') // HTTP POST request tới /auth/signup
  async signup(@Body() signupDto: SignupDto) {
    // Xử lý đăng ký người dùng mới
    return this.authService.signup(signupDto);
  }
}
