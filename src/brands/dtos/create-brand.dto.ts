import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Tên thương hiệu',
    example: 'Apple',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  brand_name: string;

  @ApiProperty({
    description: 'Mô tả thương hiệu',
    example: 'Công ty công nghệ đa quốc gia của Mỹ',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
