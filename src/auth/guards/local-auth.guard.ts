/**
 * File: local-auth.guard.ts
 * Mô tả: Guard bảo vệ các route yêu cầu xác thực bằng username/password
 *
 * Chức năng:
 * - Kiểm tra và xác thực thông tin đăng nhập (username/password) trong request
 * - Bảo vệ các route khỏi truy cập trái phép
 * - Sử dụng Local strategy đã cấu hình trong hệ thống
 */

import { Injectable } from '@nestjs/common'; // Decorator để đánh dấu class có thể inject
import { AuthGuard } from '@nestjs/passport'; // Base class cho Passport guard

@Injectable() // Đánh dấu class có thể inject
export class LocalAuthGuard extends AuthGuard('local') {} // Kế thừa từ AuthGuard và sử dụng strategy 'local'
