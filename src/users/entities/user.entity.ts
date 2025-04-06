/**
 * File: user.entity.ts
 * Mô tả: Entity đại diện cho người dùng trong hệ thống
 *
 * Chức năng:
 * - Định nghĩa cấu trúc bảng users trong database
 * - Định nghĩa các mối quan hệ với các entity khác
 * - Cung cấp metadata cho Swagger API docs
 */

import {
  Entity, // Decorator đánh dấu class là một entity
  PrimaryGeneratedColumn, // Decorator tạo primary key tự động tăng
  Column, // Decorator đánh dấu trường dữ liệu
  CreateDateColumn, // Decorator tự động tạo timestamp khi tạo record
  UpdateDateColumn, // Decorator tự động cập nhật timestamp khi cập nhật record
  OneToMany, // Decorator định nghĩa quan hệ 1-n
  ManyToMany, // Decorator định nghĩa quan hệ n-n
  JoinTable, // Decorator định nghĩa bảng trung gian cho quan hệ n-n
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Decorators cho Swagger
import { Order } from '@/orders/entities/order.entity'; // Import entity Order
import { Role } from './role.entity'; // Import entity Role
import { AccessToken } from '@/auth/entities/access-token.entity'; // Import entity AccessToken
import { RefreshToken } from '@/auth/entities/refresh-token.entity'; // Import entity RefreshToken

@Entity('users') // Định nghĩa tên bảng trong database
export class User {
  @ApiProperty({ description: 'ID của người dùng', example: 1 }) // Metadata cho Swagger
  @PrimaryGeneratedColumn() // Tạo primary key tự động tăng
  user_id: number; // ID của người dùng

  @ApiProperty({ description: 'Tên đăng nhập', example: 'johndoe' }) // Metadata cho Swagger
  @Column({ unique: true }) // Cột có ràng buộc unique (không trùng lặp)
  username: string; // Tên đăng nhập

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'john.doe@example.com',
  }) // Metadata cho Swagger
  @Column({ unique: true }) // Cột có ràng buộc unique (không trùng lặp)
  email: string; // Email của người dùng

  @Column() // Cột thông thường
  password_hash: string; // Mật khẩu đã được mã hóa (hash)

  @ApiPropertyOptional({ description: 'Tên đầy đủ', example: 'John Doe' }) // Metadata cho Swagger
  @Column({ nullable: true }) // Cột có thể NULL (không bắt buộc)
  full_name: string; // Tên đầy đủ của người dùng

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '+84 123 456 789',
  }) // Metadata cho Swagger
  @Column({ nullable: true }) // Cột có thể NULL (không bắt buộc)
  phone: string; // Số điện thoại

  @ApiPropertyOptional({
    description: 'Địa chỉ',
    example: '123 Main St, City, Country',
  }) // Metadata cho Swagger
  @Column({ nullable: true }) // Cột có thể NULL (không bắt buộc)
  address: string; // Địa chỉ

  @ApiProperty({ description: 'Tên', example: 'John' }) // Metadata cho Swagger
  @Column() // Cột thông thường
  first_name: string; // Tên

  @ApiProperty({ description: 'Họ', example: 'Doe' }) // Metadata cho Swagger
  @Column() // Cột thông thường
  last_name: string; // Họ

  @ApiProperty({ description: 'Trạng thái người dùng', example: true }) // Metadata cho Swagger
  @Column({ default: true }) // Cột có giá trị mặc định là true
  is_active: boolean; // Trạng thái hoạt động của người dùng

  @ApiProperty({ description: 'Thời gian tạo' }) // Metadata cho Swagger
  @CreateDateColumn() // Tự động tạo timestamp khi tạo record
  created_at: Date; // Thời gian tạo record

  @ApiProperty({ description: 'Thời gian cập nhật' }) // Metadata cho Swagger
  @UpdateDateColumn() // Tự động cập nhật timestamp khi cập nhật record
  updated_at: Date; // Thời gian cập nhật record

  @ApiPropertyOptional({
    description: 'Danh sách đơn hàng của người dùng',
    type: 'array',
  }) // Metadata cho Swagger
  @OneToMany(() => Order, (order) => order.user) // Quan hệ 1-n với Order (1 user có nhiều order)
  orders: Order[]; // Danh sách đơn hàng của người dùng

  @ApiPropertyOptional({
    description: 'Danh sách vai trò của người dùng',
    type: 'array',
  }) // Metadata cho Swagger
  @ManyToMany(() => Role) // Quan hệ n-n với Role (1 user có nhiều role, 1 role có nhiều user)
  @JoinTable({
    name: 'user_roles', // Tên bảng trung gian
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' }, // Cột tham chiếu đến User
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' }, // Cột tham chiếu đến Role
  })
  roles: Role[]; // Danh sách vai trò của người dùng

  @OneToMany(() => AccessToken, (token) => token.user) // Quan hệ 1-n với AccessToken (1 user có nhiều token)
  access_tokens: AccessToken[]; // Danh sách access token của người dùng

  @OneToMany(() => RefreshToken, (token) => token.user) // Quan hệ 1-n với RefreshToken (1 user có nhiều token)
  refresh_tokens: RefreshToken[]; // Danh sách refresh token của người dùng
}
