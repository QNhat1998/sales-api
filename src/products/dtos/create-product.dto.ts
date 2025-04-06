import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsUrl,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'iPhone 13 Pro Max',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  product_name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example:
      'Điện thoại iPhone 13 Pro Max mới nhất từ Apple với nhiều tính năng đột phá',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID danh mục sản phẩm',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    description: 'ID thương hiệu',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  brand_id?: number;

  @ApiProperty({
    description: 'Mã SKU sản phẩm',
    example: 'IP13PM-256GB-GOLD',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({
    description: 'Giá bán sản phẩm',
    example: 30990000,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Giá nhập sản phẩm',
    example: 25000000,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cost_price?: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong kho',
    example: 100,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity_in_stock?: number;

  @ApiProperty({
    description: 'URL hình ảnh sản phẩm',
    example: 'https://example.com/images/iphone13promax.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;
}
