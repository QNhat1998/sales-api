/**
 * File: local.strategy.ts
 * Mô tả: Strategy xác thực bằng username/password trong Passport
 *
 * Chức năng:
 * - Cấu hình xác thực local (username/password) sử dụng Passport
 * - Xác thực người dùng thông qua AuthService
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'; // Exception và decorator
import { PassportStrategy } from '@nestjs/passport'; // Base class cho Passport strategy
import { Strategy } from 'passport-local'; // Strategy xác thực local từ passport-local
import { AuthService } from '../services/auth.service'; // Service xác thực

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(); // Khởi tạo strategy với cấu hình mặc định
  }

  /**
   * Xác thực người dùng bằng username và password
   * @param username Tên đăng nhập
   * @param password Mật khẩu
   * @returns Thông tin người dùng đã xác thực
   * @throws UnauthorizedException nếu xác thực thất bại
   */
  async validate(username: string, password: string): Promise<any> {
    // Gọi AuthService để xác thực
    const user = await this.authService.validateUser(username, password);

    // Nếu không tìm thấy user hoặc sai password
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Trả về thông tin user nếu xác thực thành công
    return user;
  }
}
