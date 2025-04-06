import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { ProductsModule } from '@/products/products.module';
import { UsersModule } from '@/users/users.module';

/**
 * Module quản lý đơn hàng
 * - Quản lý danh sách đơn hàng
 * - Quản lý thông tin chi tiết đơn hàng
 * - Quản lý trạng thái đơn hàng
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
