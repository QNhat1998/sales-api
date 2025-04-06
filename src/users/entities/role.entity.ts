/**
 * File: role.entity.ts
 * Mô tả: Entity đại diện cho vai trò (role) trong hệ thống
 *
 * Chức năng:
 * - Định nghĩa cấu trúc bảng roles trong database
 * - Định nghĩa mối quan hệ với entity User
 * - Quản lý phân quyền trong hệ thống
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'; // Import các decorator từ TypeORM
import { User } from './user.entity'; // Import entity User để thiết lập quan hệ

@Entity('roles') // Định nghĩa tên bảng trong database
export class Role {
  @PrimaryGeneratedColumn() // Tạo primary key tự động tăng
  role_id: number; // ID của vai trò

  @Column({ unique: true }) // Cột có ràng buộc unique (không trùng lặp)
  role_name: string; // Tên vai trò (VD: admin, user, moderator)

  @Column({ nullable: true }) // Cột có thể NULL (không bắt buộc)
  description: string; // Mô tả về vai trò

  @ManyToMany(() => User, (user) => user.roles) // Quan hệ n-n với User (1 role có nhiều user, 1 user có nhiều role)
  users: User[]; // Danh sách người dùng có vai trò này
}
