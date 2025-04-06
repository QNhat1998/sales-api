/**
 * Module quản lý người dùng
 * Đăng ký các entity liên quan đến người dùng với TypeORM
 * Cung cấp các controller và service để quản lý người dùng
 */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Role } from './entities/role.entity';
import { OrdersModule } from '@/orders/orders.module';
import { AccessToken } from '@/auth/entities/access-token.entity';
import { RefreshToken } from '@/auth/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, AccessToken, RefreshToken]),
    forwardRef(() => OrdersModule), // Sử dụng forwardRef để giải quyết circular dependency
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
