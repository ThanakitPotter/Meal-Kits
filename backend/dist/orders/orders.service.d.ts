import type { Order } from './orders.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenusService } from '../menus/menus.service';
export declare class OrdersService {
    private readonly menusService;
    private orders;
    private nextId;
    constructor(menusService: MenusService);
    findAll(): Order[];
    findOne(id: string): Order | undefined;
    create(createOrderDto: CreateOrderDto): Order;
    updateStatus(id: string, status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว'): Order | undefined;
}
