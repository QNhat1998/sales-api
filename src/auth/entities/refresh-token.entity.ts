/**
 * File: refresh-token.entity.ts
 * Mô tả: Entity đại diện cho refresh token trong hệ thống xác thực
 *
 * Chức năng:
 * - Định nghĩa cấu trúc bảng refresh_tokens trong database
 * - Quản lý các token làm mới để cấp lại access token khi hết hạn
 * - Thiết lập mối quan hệ với entity User
 */

import {
  Entity, // Decorator đánh dấu class là một entity
  PrimaryGeneratedColumn, // Decorator tạo primary key tự động tăng
  Column, // Decorator đánh dấu trường dữ liệu
  ManyToOne, // Decorator định nghĩa quan hệ n-1
  JoinColumn, // Decorator xác định cột khóa ngoại
  CreateDateColumn, // Decorator tự động tạo timestamp khi tạo record
} from 'typeorm';
import { User } from '@/users/entities/user.entity'; // Import entity User

@Entity('refresh_tokens') // Định nghĩa tên bảng trong database
export class RefreshToken {
  @PrimaryGeneratedColumn() // Tạo primary key tự động tăng
  token_id: number; // ID của token

  @Column() // Cột thông thường
  user_id: number; // ID của người dùng sở hữu token

  @Column({ unique: true }) // Cột có ràng buộc unique (không trùng lặp)
  token: string; // Chuỗi token

  @Column() // Cột thông thường
  expires_at: Date; // Thời gian hết hạn của token

  @CreateDateColumn() // Tự động tạo timestamp khi tạo record
  created_at: Date; // Thời gian tạo token

  @ManyToOne(() => User, (user) => user.refresh_tokens) // Quan hệ n-1 với User (nhiều token thuộc về 1 user)
  @JoinColumn({ name: 'user_id' }) // Chỉ định cột khóa ngoại
  user: User; // Người dùng sở hữu token
}
