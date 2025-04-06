import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  category_name?: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Các loại điện thoại di động, smartphone cao cấp',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
