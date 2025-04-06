/**
 * File: order.entity.ts
 * Mô tả: Entity đại diện cho đơn hàng trong hệ thống
 *
 * Chức năng:
 * - Định nghĩa cấu trúc bảng orders trong database
 * - Quản lý thông tin đơn hàng của người dùng
 * - Thiết lập mối quan hệ với các entity liên quan (User, OrderItem, Payment)
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '@/payments/entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ nullable: true })
  user_id: number;

  @CreateDateColumn()
  order_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ nullable: true })
  shipping_address: string;

  @Column({ nullable: true })
  shipping_city: string;

  @Column({ nullable: true })
  shipping_state: string;

  @Column({ nullable: true })
  shipping_postal_code: string;

  @Column({ nullable: true })
  shipping_country: string;

  @Column({ nullable: true })
  payment_method: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  })
  payment_status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
