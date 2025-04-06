import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  category_name: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Các loại điện thoại di động, smartphone',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
