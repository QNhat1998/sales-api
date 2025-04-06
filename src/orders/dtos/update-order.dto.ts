import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: 'processing',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: false,
  })
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: false,
  })
  @IsString()
  @IsOptional()
  shipping_address?: string;

  @ApiProperty({
    description: 'Phương thức vận chuyển',
    example: 'express',
    required: false,
  })
  @IsString()
  @IsOptional()
  shipping_method?: string;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'cod',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_method?: string;
}
