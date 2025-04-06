import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: ' ',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
