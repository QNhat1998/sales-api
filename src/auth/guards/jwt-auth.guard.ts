/**
 * File: jwt-auth.guard.ts
 * Mô tả: Guard bảo vệ các route yêu cầu xác thực bằng JWT
 *
 * Chức năng:
 * - Kiểm tra và xác thực JWT token trong request
 * - Bảo vệ các route khỏi truy cập trái phép
 * - Sử dụng JWT strategy đã cấu hình trong hệ thống
 */

import { Injectable } from '@nestjs/common'; // Decorator để đánh dấu class có thể inject
import { AuthGuard } from '@nestjs/passport'; // Base class cho Passport guard

@Injectable() // Đánh dấu class có thể inject
export class JwtAuthGuard extends AuthGuard('jwt') {} // Kế thừa từ AuthGuard và sử dụng strategy 'jwt'
