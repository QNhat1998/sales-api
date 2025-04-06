/**
 * File: categories.module.ts
 * Mô tả: Module quản lý danh mục sản phẩm trong hệ thống
 *
 * Chức năng:
 * - Đăng ký entity Category với TypeORM
 * - Khai báo controller và service liên quan đến danh mục
 * - Export CategoriesService để các module khác có thể sử dụng
 */

import { Module } from '@nestjs/common'; // Import decorator Module từ NestJS
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule để đăng ký entity
import { Category } from './entities/category.entity'; // Import entity Category
import { CategoriesController } from './controllers/categories.controller'; // Import controller xử lý request về danh mục
import { CategoriesService } from './services/categories.service'; // Import service chứa logic xử lý danh mục

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Đăng ký entity Category với TypeORM
  controllers: [CategoriesController], // Khai báo controller xử lý các request liên quan đến danh mục
  providers: [CategoriesService], // Khai báo service cung cấp các phương thức xử lý danh mục
  exports: [CategoriesService], // Export CategoriesService để các module khác có thể sử dụng (như ProductsModule)
})
export class CategoriesModule {} // Export module để có thể import trong AppModule
