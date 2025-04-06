import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { OrdersModule } from '@/orders/orders.module';

/**
 * Module quản lý thanh toán
 * - Quản lý danh sách thanh toán
 * - Quản lý thông tin chi tiết thanh toán
 * - Quản lý trạng thái thanh toán
 */
@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
