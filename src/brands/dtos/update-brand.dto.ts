import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @ApiProperty({
    description: 'Tên thương hiệu',
    example: 'Apple Inc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  brand_name?: string;

  @ApiProperty({
    description: 'Mô tả thương hiệu',
    example:
      'Công ty công nghệ đa quốc gia của Mỹ chuyên sản xuất điện thoại, máy tính',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
