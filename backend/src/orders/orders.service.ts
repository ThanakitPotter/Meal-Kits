import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const menu = await this.menusService.findOne(createOrderDto.menuId);

    const basePrice = menu?.price ?? 0;
    const totalPrice =
      createOrderDto.servings === 2
        ? Math.round(basePrice * 1.8)
        : basePrice;

    const newOrder = this.ordersRepository.create({
      menuId: createOrderDto.menuId,
      userId: createOrderDto.userId,
      menuName: menu?.name ?? 'Unknown Menu',
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      servings: createOrderDto.servings,
      status: 'รอดำเนินการ',
      totalPrice,
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
