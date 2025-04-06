/**
 * File: database.config.ts
 * Mô tả: Cấu hình kết nối database MySQL cho ứng dụng
 *
 * Chức năng:
 * - Cung cấp cấu hình kết nối MySQL cho TypeORM
 * - Đọc cấu hình từ biến môi trường thông qua ConfigService
 * - Cung cấp giá trị mặc định cho các tham số kết nối
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm'; // Import TypeOrmModuleOptions để định nghĩa kiểu dữ liệu cấu hình
import { ConfigService } from '@nestjs/config'; // Import ConfigService để đọc biến môi trường

/**
 * Hàm trả về cấu hình kết nối database cho TypeORM
 * @param configService Dịch vụ cấu hình để đọc biến môi trường
 * @returns Cấu hình TypeORM cho MySQL
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql', // Loại database là MySQL
  host: configService.get<string>('DB_HOST', 'localhost'), // Địa chỉ host, mặc định là localhost
  port: configService.get<number>('DB_PORT', 3306), // Cổng kết nối, mặc định là 3306
  username: configService.get<string>('DB_USERNAME', 'root'), // Tên đăng nhập, mặc định là root
  password: configService.get<string>('DB_PASSWORD', ''), // Mật khẩu, mặc định là rỗng
  database: configService.get<string>('DB_DATABASE', 'sales_db'), // Tên database, mặc định là sales_db
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Đường dẫn đến các entity (tự động tìm kiếm)
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Tự động đồng bộ schema (không nên bật ở môi trường production)
  logging: configService.get<boolean>('DB_LOGGING', false), // Ghi log SQL query, mặc định tắt
});
