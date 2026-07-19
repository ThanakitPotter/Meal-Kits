import { Injectable } from '@nestjs/common';
import type { Order } from './orders.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: '1001',
      menuId: '1',
      menuName: 'ผัดไทยกุ้งสด',
      customerName: 'สมชาย มาลัย',
      customerPhone: '081-234-5678',
      shippingAddress: '123 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
      servings: 2,
      status: 'รอดำเนินการ',
      totalPrice: 338,
      createdAt: '2026-07-18T10:00:00Z',
    },
    {
      id: '1002',
      menuId: '2',
      menuName: 'ต้มยำกุ้งน้ำข้น',
      customerName: 'สมหญิง รักทำกับข้าว',
      customerPhone: '089-876-5432',
      shippingAddress:
        '456 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
      servings: 1,
      status: 'กำลังจัดเตรียม',
      totalPrice: 219,
      createdAt: '2026-07-18T14:30:00Z',
    },
    {
      id: '1003',
      menuId: '3',
      menuName: 'ไก่ทอดเกาหลี',
      customerName: 'วิชัย กินดี',
      customerPhone: '092-111-2222',
      shippingAddress: '789 ม.3 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      servings: 2,
      status: 'จัดส่งแล้ว',
      totalPrice: 358,
      createdAt: '2026-07-17T09:15:00Z',
    },
    {
      id: '1004',
      menuId: '1',
      menuName: 'ผัดไทยกุ้งสด',
      customerName: 'นภา สายลม',
      customerPhone: '085-333-4444',
      shippingAddress:
        '321 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
      servings: 1,
      status: 'รอดำเนินการ',
      totalPrice: 189,
      createdAt: '2026-07-19T16:45:00Z',
    },
  ];

  private nextId = 1005;

  constructor(private readonly menusService: MenusService) {}

  findAll(): Order[] {
    return this.orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  create(createOrderDto: CreateOrderDto): Order {
    const menu = this.menusService.findOne(createOrderDto.menuId);

    const basePrice = menu?.price ?? 0;
    const totalPrice =
      createOrderDto.servings === 2
        ? Math.round(basePrice * 1.8)
        : basePrice;

    const newOrder: Order = {
      id: String(this.nextId++),
      menuId: createOrderDto.menuId,
      menuName: menu?.name ?? 'Unknown Menu',
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      servings: createOrderDto.servings,
      status: 'รอดำเนินการ',
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  updateStatus(
    id: string,
    status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว',
  ): Order | undefined {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }
}
