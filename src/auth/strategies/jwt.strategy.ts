/**
 * File: jwt.strategy.ts
 * Mô tả: Strategy xác thực JWT trong Passport
 *
 * Chức năng:
 * - Cấu hình xác thực JWT sử dụng Passport
 * - Xác thực và giải mã JWT token
 * - Lấy thông tin người dùng từ payload trong token
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'; // Exception và decorator
import { PassportStrategy } from '@nestjs/passport'; // Base class cho Passport strategy
import { ExtractJwt, Strategy } from 'passport-jwt'; // Các utility từ passport-jwt
import { ConfigService } from '@nestjs/config'; // Service đọc cấu hình
import { UsersService } from '@/users/services/users.service'; // Service người dùng

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, // Inject ConfigService
    private readonly usersService: UsersService, // Inject UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ Authorization header dạng Bearer
      ignoreExpiration: false, // Kiểm tra hết hạn của token
      secretOrKey: configService.get<string>('JWT_SECRET', 'supersecret'), // Lấy secret key từ biến môi trường
    });
  }

  /**
   * Validate JWT payload và trả về thông tin người dùng
   * @param payload Payload được giải mã từ JWT
   * @returns Thông tin người dùng để gắn vào request
   * @throws UnauthorizedException nếu người dùng không tồn tại hoặc không active
   */
  async validate(payload: any) {
    try {
      // Tìm người dùng theo ID từ payload
      const user = await this.usersService.findOne(payload.sub);

      // Kiểm tra người dùng tồn tại và đang active
      if (!user || !user.is_active) {
        throw new UnauthorizedException('User is inactive or does not exist');
      }

      // Trả về thông tin người dùng để gắn vào request.user
      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
