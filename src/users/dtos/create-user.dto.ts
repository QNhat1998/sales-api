/**
 * File: create-user.dto.ts
 * Mô tả: Data Transfer Object cho việc tạo người dùng mới
 *
 * Chức năng:
 * - Định nghĩa cấu trúc dữ liệu cho request tạo người dùng mới
 * - Cung cấp validation cho dữ liệu đầu vào
 * - Cung cấp metadata cho Swagger API docs
 */

import {
  IsEmail, // Validator kiểm tra định dạng email
  IsNotEmpty, // Validator kiểm tra trường không được trống
  IsOptional, // Validator đánh dấu trường không bắt buộc
  IsString, // Validator kiểm tra kiểu dữ liệu string
  MinLength, // Validator kiểm tra độ dài tối thiểu
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Decorators cho Swagger

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'johndoe',
  }) // Metadata cho Swagger
  @IsNotEmpty() // Validate: Không được trống
  @IsString() // Validate: Phải là string
  username: string; // Tên đăng nhập

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'john.doe@example.com',
  }) // Metadata cho Swagger
  @IsNotEmpty() // Validate: Không được trống
  @IsEmail() // Validate: Phải đúng định dạng email
  email: string; // Email

  @ApiProperty({
    description: 'Mật khẩu của người dùng (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
  }) // Metadata cho Swagger
  @IsNotEmpty() // Validate: Không được trống
  @IsString() // Validate: Phải là string
  @MinLength(6) // Validate: Độ dài tối thiểu 6 ký tự
  password: string; // Mật khẩu

  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'John',
  }) // Metadata cho Swagger
  @IsNotEmpty() // Validate: Không được trống
  @IsString() // Validate: Phải là string
  first_name: string; // Tên

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Doe',
  }) // Metadata cho Swagger
  @IsNotEmpty() // Validate: Không được trống
  @IsString() // Validate: Phải là string
  last_name: string; // Họ

  @ApiPropertyOptional({
    description: 'Tên đầy đủ của người dùng',
    example: 'John Doe',
  }) // Metadata cho Swagger (không bắt buộc)
  @IsOptional() // Validate: Trường không bắt buộc
  @IsString() // Validate: Phải là string nếu có
  full_name?: string; // Tên đầy đủ (có thể null)

  @ApiPropertyOptional({
    description: 'Số điện thoại của người dùng',
    example: '+84 123 456 789',
  }) // Metadata cho Swagger (không bắt buộc)
  @IsOptional() // Validate: Trường không bắt buộc
  @IsString() // Validate: Phải là string nếu có
  phone?: string; // Số điện thoại (có thể null)

  @ApiPropertyOptional({
    description: 'Địa chỉ của người dùng',
    example: '123 Main St, City, Country',
  }) // Metadata cho Swagger (không bắt buộc)
  @IsOptional() // Validate: Trường không bắt buộc
  @IsString() // Validate: Phải là string nếu có
  address?: string; // Địa chỉ (có thể null)
}
