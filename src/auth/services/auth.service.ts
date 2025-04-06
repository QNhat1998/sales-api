/**
 * File: auth.service.ts
 * Mô tả: Service xử lý logic nghiệp vụ liên quan đến xác thực người dùng
 *
 * Chức năng:
 * - Xác thực người dùng bằng username và password
 * - Tạo và quản lý JWT (access token, refresh token)
 * - Xử lý đăng nhập, đăng xuất, đăng ký
 * - Lưu trữ và quản lý token trong database
 */

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/services/users.service';
import { AccessToken } from '@/auth/entities/access-token.entity';
import { RefreshToken } from '@/auth/entities/refresh-token.entity';
import { LoginDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Xác thực user bằng username và password
   * @param username Tên đăng nhập
   * @param password Mật khẩu
   * @returns Thông tin user nếu xác thực thành công, null nếu thất bại
   */
  async validateUser(username: string, password: string): Promise<any> {
    try {
      // Tìm user bằng username
      const user = await this.usersService.findByUsername(username);

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (isPasswordValid) {
        // Trả về thông tin user, bỏ password_hash
        const { password_hash, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Đăng nhập và tạo token
   * @param loginDto Thông tin đăng nhập
   * @returns Access token và refresh token
   */
  async login(loginDto: LoginDto) {
    // Xác thực user
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Tạo token
    const tokens = await this.createTokens(user);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      ...tokens,
    };
  }

  /**
   * Tạo access token và refresh token mới
   * @param user Thông tin user
   * @returns Access token và refresh token
   */
  async createTokens(user: any) {
    // Payload cho JWT
    console.log(user);
    const payload = { username: user.username, sub: user.user_id };

    // Tạo access token
    const accessToken = this.jwtService.sign(payload);

    // Tạo refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Tính thời gian hết hạn
    const accessTokenExpires = new Date();
    accessTokenExpires.setSeconds(
      accessTokenExpires.getSeconds() +
        parseInt(
          this.configService
            .get<string>('JWT_EXPIRES_IN', '900')
            .replace(/\D/g, ''),
        ),
    );

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setSeconds(
      refreshTokenExpires.getSeconds() +
        parseInt(
          this.configService
            .get<string>('JWT_REFRESH_EXPIRES_IN', '604800')
            .replace(/\D/g, ''),
        ),
    );

    // Lưu access token vào database
    await this.accessTokenRepository.save({
      user_id: user.user_id,
      token: accessToken,
      expires_at: accessTokenExpires,
    });

    // Lưu refresh token vào database
    await this.refreshTokenRepository.save({
      user_id: user.user_id,
      token: refreshToken,
      expires_at: refreshTokenExpires,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Làm mới token
   * @param refreshTokenDto Refresh token
   * @returns Access token và refresh token mới
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Tìm refresh token trong database
      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: { token: refreshTokenDto.refresh_token },
        relations: ['user'],
      });

      if (!refreshTokenEntity) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Kiểm tra token có hết hạn không
      if (new Date() > refreshTokenEntity.expires_at) {
        await this.refreshTokenRepository.remove(refreshTokenEntity);
        throw new UnauthorizedException('Refresh token expired');
      }

      // Xóa token cũ
      await this.refreshTokenRepository.remove(refreshTokenEntity);

      // Tạo token mới
      const user = refreshTokenEntity.user;
      const tokens = await this.createTokens(user);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Đăng xuất
   * @param userId ID của user
   * @param token Access token
   */
  async logout(userId: number, token: string) {
    // Xóa access token
    await this.accessTokenRepository.delete({
      user_id: userId,
      token,
    });
  }

  /**
   * Đăng ký tài khoản mới
   * @param signupDto Thông tin đăng ký
   * @returns Thông tin người dùng và tokens
   */
  async signup(signupDto: SignupDto) {
    // Tạo user mới sử dụng usersService
    const user = await this.usersService.create(signupDto);

    // Loại bỏ password_hash trước khi trả về
    const { password_hash, ...result } = user;

    // Tạo tokens
    const tokens = await this.createTokens(result);

    return {
      user: {
        user_id: result.user_id,
        username: result.username,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
      },
      ...tokens,
    };
  }
}
