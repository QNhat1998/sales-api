import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { OrdersService } from '@/orders/services/orders.service';

/**
 * Service quản lý thanh toán
 */
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Lấy danh sách thanh toán có phân trang
   * @param page Trang hiện tại
   * @param limit Số lượng thanh toán mỗi trang
   * @returns Danh sách thanh toán và tổng số thanh toán
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Payment[]; total: number }> {
    const [data, total] = await this.paymentsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['order'],
      order: { payment_date: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Lấy thông tin chi tiết thanh toán theo ID
   * @param id ID thanh toán
   * @returns Thông tin chi tiết thanh toán
   */
  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { payment_id: id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  /**
   * Lấy thanh toán theo ID đơn hàng
   * @param orderId ID đơn hàng
   * @returns Danh sách thanh toán
   */
  async findByOrderId(orderId: number): Promise<Payment[]> {
    // Kiểm tra đơn hàng tồn tại
    await this.ordersService.findOne(orderId);

    const payments = await this.paymentsRepository.find({
      where: { order_id: orderId },
      order: { payment_date: 'DESC' },
    });

    return payments;
  }
}
