/**
 * File: app.module.ts
 * Mô tả: Đây là module gốc của ứng dụng NestJS, nơi cấu hình các module khác
 *
 * Chức năng chính:
 * 1. Cấu hình biến môi trường với ConfigModule
 * 2. Cấu hình kết nối database với TypeOrmModule
 * 3. Import các module chức năng của ứng dụng
 * 4. Đăng ký controller và service cấp ứng dụng
 */

import { Module } from '@nestjs/common'; // Import decorator Module từ NestJS
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule để kết nối với database
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule để đọc biến môi trường
import { AppController } from '@/app.controller'; // Import controller chính của ứng dụng
import { AppService } from '@/app.service'; // Import service chính của ứng dụng
import { UsersModule } from '@/users/users.module'; // Import module quản lý người dùng
import { ProductsModule } from '@/products/products.module'; // Import module quản lý sản phẩm
import { CategoriesModule } from '@/categories/categories.module'; // Import module quản lý danh mục
import { BrandsModule } from '@/brands/brands.module'; // Import module quản lý thương hiệu
import { OrdersModule } from '@/orders/orders.module'; // Import module quản lý đơn hàng
import { PaymentsModule } from '@/payments/payments.module'; // Import module quản lý thanh toán
import { AuthModule } from '@/auth/auth.module'; // Import module xác thực người dùng
import { getDatabaseConfig } from '@/config/database.config'; // Import hàm cấu hình kết nối database

@Module({
  imports: [
    // Cấu hình ConfigModule để đọc biến môi trường từ file .env
    ConfigModule.forRoot({
      isGlobal: true, // Đặt là global để có thể inject ConfigService ở bất kỳ đâu trong ứng dụng
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`, // Đọc file .env tương ứng với môi trường (development, production, testing...)
    }),

    // Cấu hình TypeOrmModule để kết nối với database MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
      inject: [ConfigService], // Inject ConfigService để đọc biến môi trường
      useFactory: getDatabaseConfig, // Sử dụng hàm getDatabaseConfig để lấy cấu hình kết nối
    }),

    // Import các module chức năng của ứng dụng
    UsersModule, // Module quản lý người dùng (đăng ký, đăng nhập, CRUD người dùng)
    ProductsModule, // Module quản lý sản phẩm (CRUD sản phẩm)
    CategoriesModule, // Module quản lý danh mục sản phẩm (CRUD danh mục)
    BrandsModule, // Module quản lý thương hiệu sản phẩm (CRUD thương hiệu)
    OrdersModule, // Module quản lý đơn hàng (đặt hàng, xem đơn hàng, cập nhật trạng thái)
    PaymentsModule, // Module quản lý thanh toán (xử lý thanh toán, lịch sử thanh toán)
    AuthModule, // Module xác thực người dùng (JWT, đăng nhập, đăng xuất, làm mới token)
  ],
  controllers: [AppController], // Đăng ký controller chính của ứng dụng
  providers: [AppService], // Đăng ký service chính của ứng dụng
})
export class AppModule {} // Export AppModule để được sử dụng trong file main.ts
