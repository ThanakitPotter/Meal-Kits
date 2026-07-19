import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenusService } from '../menus/menus.service';
export declare class OrdersService {
    private ordersRepository;
    private readonly menusService;
    constructor(ordersRepository: Repository<Order>, menusService: MenusService);
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order | null>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    updateStatus(id: string, status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว'): Promise<Order | null>;
}
