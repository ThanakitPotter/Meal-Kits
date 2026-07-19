import { Injectable } from '@nestjs/common';
import type { Order } from './orders.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { PackagesService } from '../packages/packages.service';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: '1001',
      packageId: '2',
      packageName: 'สายซ้อมฮาล์ฟมาราธอน',
      customerName: 'สมชาย วิ่งเร็ว',
      customerEmail: 'somchai@email.com',
      customerPhone: '081-234-5678',
      shippingAddress: '123 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
      deliveryMonth: '07/2026',
      status: 'Preparing',
      totalPrice: 1290,
      createdAt: '2026-07-01T10:00:00Z',
    },
    {
      id: '1002',
      packageId: '1',
      packageName: 'สายวิ่ง 5K Starter',
      customerName: 'สมหญิง รักวิ่ง',
      customerEmail: 'somying@email.com',
      customerPhone: '089-876-5432',
      shippingAddress: '456 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
      deliveryMonth: '07/2026',
      status: 'Shipped',
      totalPrice: 890,
      createdAt: '2026-07-02T14:30:00Z',
    },
    {
      id: '1003',
      packageId: '3',
      packageName: 'สายรีคัฟเวอรี่',
      customerName: 'วิชัย มาราธอน',
      customerEmail: 'wichai@email.com',
      customerPhone: '092-111-2222',
      shippingAddress: '789 ม.3 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      deliveryMonth: '07/2026',
      status: 'Delivered',
      totalPrice: 990,
      createdAt: '2026-06-28T09:15:00Z',
    },
    {
      id: '1004',
      packageId: '2',
      packageName: 'สายซ้อมฮาล์ฟมาราธอน',
      customerName: 'นภา สายลม',
      customerEmail: 'napa@email.com',
      customerPhone: '085-333-4444',
      shippingAddress: '321 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
      deliveryMonth: '08/2026',
      status: 'Preparing',
      totalPrice: 1290,
      createdAt: '2026-07-15T16:45:00Z',
    },
  ];

  private nextId = 1005;

  constructor(private readonly packagesService: PackagesService) {}

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
    const pkg = this.packagesService.findOne(createOrderDto.packageId);

    const now = new Date();
    const deliveryMonth = `${String(now.getMonth() + 2).padStart(2, '0')}/${now.getFullYear()}`;

    const newOrder: Order = {
      id: String(this.nextId++),
      packageId: createOrderDto.packageId,
      packageName: pkg?.name ?? 'Unknown Package',
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      deliveryMonth,
      status: 'Preparing',
      totalPrice: pkg?.price ?? 0,
      createdAt: now.toISOString(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  updateStatus(
    id: string,
    status: 'Preparing' | 'Shipped' | 'Delivered',
  ): Order | undefined {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }
}
