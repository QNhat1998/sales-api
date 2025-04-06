import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { ProductsService } from '@/products/services/products.service';
import { UsersService } from '@/users/services/users.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

/**
 * Service quản lý đơn hàng
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Lấy danh sách đơn hàng có phân trang
   * @param page Trang hiện tại
   * @param limit Số lượng đơn hàng mỗi trang
   * @returns Danh sách đơn hàng và tổng số đơn hàng
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Order[]; total: number }> {
    const [data, total] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order: { order_date: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Lấy thông tin chi tiết đơn hàng theo ID
   * @param id ID đơn hàng
   * @returns Thông tin chi tiết đơn hàng
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { order_id: id },
      relations: ['user', 'order_items', 'order_items.product', 'payments'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Lấy đơn hàng theo ID người dùng
   * @param userId ID người dùng
   * @param page Trang hiện tại
   * @param limit Số lượng đơn hàng mỗi trang
   * @returns Danh sách đơn hàng và tổng số đơn hàng
   */
  async findByUserId(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<{ data: Order[]; total: number }> {
    // Kiểm tra người dùng tồn tại
    await this.usersService.findOne(userId);

    const [data, total] = await this.ordersRepository.findAndCount({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['order_items'],
      order: { order_date: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Lấy danh sách các mục trong đơn hàng
   * @param orderId ID đơn hàng
   * @returns Danh sách các mục trong đơn hàng
   */
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const order = await this.findOne(orderId);

    return order.order_items;
  }

  /**
   * Tạo đơn hàng mới
   * @param createOrderDto Dữ liệu đơn hàng mới
   * @returns Thông tin đơn hàng đã tạo
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Kiểm tra người dùng tồn tại
    await this.usersService.findOne(createOrderDto.user_id);

    // Tạo đơn hàng mới
    const order = this.ordersRepository.create({
      user_id: createOrderDto.user_id,
      order_date: new Date(),
      status: createOrderDto.status || 'pending',
      shipping_address: createOrderDto.shipping_address,
      payment_method: createOrderDto.payment_method,
      total_amount: 0,
      payment_status: 'pending',
    });

    // Lưu đơn hàng để lấy ID
    const savedOrder = await this.ordersRepository.save(order);

    // Tính tổng tiền và tạo các mục đơn hàng
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // Kiểm tra danh sách sản phẩm
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Tạo các mục đơn hàng
    for (const item of createOrderDto.items) {
      // Kiểm tra sản phẩm tồn tại
      const product = await this.productsService.findOne(item.product_id);

      // Tạo mục đơn hàng
      const orderItem = this.orderItemsRepository.create({
        order_id: savedOrder.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: product.price * item.quantity,
      });

      // Thêm vào danh sách
      orderItems.push(orderItem);
      totalAmount += orderItem.subtotal;
    }

    // Lưu các mục đơn hàng
    await this.orderItemsRepository.save(orderItems);

    // Cập nhật tổng tiền đơn hàng
    savedOrder.total_amount = totalAmount;
    await this.ordersRepository.save(savedOrder);

    // Trả về đơn hàng đã tạo kèm theo các mục
    return this.findOne(savedOrder.order_id);
  }

  /**
   * Cập nhật thông tin đơn hàng
   * @param id ID của đơn hàng
   * @param updateOrderDto Dữ liệu cập nhật
   * @returns Thông tin đơn hàng đã cập nhật
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Kiểm tra đơn hàng tồn tại
    const order = await this.findOne(id);

    // Cập nhật các trường thông tin đơn hàng
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
    if (updateOrderDto.shipping_address) {
      order.shipping_address = updateOrderDto.shipping_address;
    }
    if (updateOrderDto.payment_method) {
      order.payment_method = updateOrderDto.payment_method;
    }

    // Lưu thông tin đơn hàng đã cập nhật
    await this.ordersRepository.save(order);

    // Trả về đơn hàng đã cập nhật
    return this.findOne(id);
  }

  /**
   * Xóa đơn hàng
   * @param id ID của đơn hàng
   */
  async remove(id: number): Promise<void> {
    // Kiểm tra đơn hàng tồn tại
    const order = await this.findOne(id);

    // Xóa các mục đơn hàng trước
    await this.orderItemsRepository.delete({ order_id: id });

    // Xóa đơn hàng
    await this.ordersRepository.remove(order);
  }
}
