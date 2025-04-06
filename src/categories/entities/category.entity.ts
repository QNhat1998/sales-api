/**
 * File: category.entity.ts
 * Mô tả: Entity đại diện cho danh mục sản phẩm trong hệ thống
 *
 * Chức năng:
 * - Định nghĩa cấu trúc bảng categories trong database
 * - Định nghĩa mối quan hệ với entity Product
 * - Quản lý thông tin danh mục sản phẩm
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // Import các decorator từ TypeORM
import { Product } from '@/products/entities/product.entity'; // Import entity Product để thiết lập quan hệ

@Entity('categories') // Định nghĩa tên bảng trong database
export class Category {
  @PrimaryGeneratedColumn() // Tạo primary key tự động tăng
  category_id: number; // ID của danh mục

  @Column() // Cột thông thường
  category_name: string; // Tên danh mục

  @Column({ type: 'text', nullable: true }) // Cột kiểu text, có thể NULL
  description: string; // Mô tả về danh mục

  @OneToMany(() => Product, (product) => product.category) // Quan hệ 1-n với Product (1 danh mục có nhiều sản phẩm)
  products: Product[]; // Danh sách sản phẩm thuộc danh mục này
}
