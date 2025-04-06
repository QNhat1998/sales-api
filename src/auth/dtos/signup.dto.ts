import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'nguoidung1',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'nguoidung1@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyen',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Van A',
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Tên đầy đủ của người dùng',
    example: 'Nguyen Van A',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại của người dùng',
    example: '+84 123 456 789',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ của người dùng',
    example: '123 Đường ABC, Quận XYZ, TP.HCM',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
