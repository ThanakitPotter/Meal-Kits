import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private readonly menusService: MenusService,
  ) {}

  private async generateOrderId(orderType: 'subscription' | 'one-time'): Promise<string> {
    const prefix = orderType === 'subscription' ? 'SUB' : 'ONE';
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yymm = `${yy}${mm}`;

    const lastOrder = await this.ordersRepository.findOne({
      where: { id: Like(`${prefix}-${yymm}-%`) },
      order: { id: 'DESC' },
    });

    let sequence = 1;
    if (lastOrder) {
      const parts = lastOrder.id.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2], 10) + 1;
      }
    }

    const sequenceStr = String(sequence).padStart(3, '0');
    return `${prefix}-${yymm}-${sequenceStr}`;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findByUserId(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<Order | null> {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const id = await this.generateOrderId(createOrderDto.orderType);
    
    const newOrder = this.ordersRepository.create({
      id,
      orderType: createOrderDto.orderType,
      userId: createOrderDto.userId,
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      items: createOrderDto.items,
      status: 'รอดำเนินการ',
      totalPrice: createOrderDto.totalPrice,
    });

    return this.ordersRepository.save(newOrder);
  }

  async updateStatus(
    id: string,
    status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว',
  ): Promise<Order | null> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (order) {
      order.status = status;
      return this.ordersRepository.save(order);
    }
    return null;
  }
}
