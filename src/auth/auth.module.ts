/**
 * File: auth.module.ts
 * Mô tả: Module xác thực và phân quyền trong hệ thống
 *
 * Chức năng:
 * - Quản lý quá trình đăng nhập, đăng ký và xác thực người dùng
 * - Cấu hình JWT (JSON Web Token) cho xác thực
 * - Khai báo các strategy xác thực (JWT, Local)
 * - Đăng ký các entity liên quan đến xác thực (AccessToken, RefreshToken)
 */

import { Module } from '@nestjs/common'; // Import decorator Module từ NestJS
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule để đăng ký entity
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule để xử lý JWT
import { PassportModule } from '@nestjs/passport'; // Import PassportModule cho xác thực
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule để đọc biến môi trường
import { UsersModule } from '@/users/users.module'; // Import UsersModule để sử dụng UsersService
import { AuthController } from './controllers/auth.controller'; // Import controller xác thực
import { AuthService } from './services/auth.service'; // Import service xác thực
import { JwtStrategy } from './strategies/jwt.strategy'; // Import strategy xác thực JWT
import { LocalStrategy } from './strategies/local.strategy'; // Import strategy xác thực Local
import { AccessToken } from './entities/access-token.entity'; // Import entity AccessToken
import { RefreshToken } from './entities/refresh-token.entity'; // Import entity RefreshToken

@Module({
  imports: [
    UsersModule, // Import UsersModule để sử dụng UsersService cho việc xác thực người dùng
    PassportModule, // Cung cấp cơ chế xác thực với Passport
    TypeOrmModule.forFeature([AccessToken, RefreshToken]), // Đăng ký entity AccessToken và RefreshToken với TypeORM
    JwtModule.registerAsync({
      // Cấu hình động cho JwtModule
      imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'supersecret'), // Lấy JWT_SECRET từ biến môi trường, mặc định là 'supersecret'
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'), // Thời gian hết hạn của token, mặc định là 15 phút
        },
      }),
    }),
  ],
  controllers: [AuthController], // Đăng ký controller xử lý các request liên quan đến xác thực
  providers: [AuthService, JwtStrategy, LocalStrategy], // Đăng ký service và các strategy xác thực
  exports: [AuthService], // Export AuthService để các module khác có thể sử dụng
})
export class AuthModule {} // Export module để import trong AppModule
