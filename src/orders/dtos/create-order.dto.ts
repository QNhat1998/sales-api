import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID sản phẩm',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID người dùng',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @ApiProperty({
    description: 'Phương thức vận chuyển',
    example: 'express',
  })
  @IsString()
  @IsNotEmpty()
  shipping_method: string;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'cod',
  })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm trong đơn hàng',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];
}
