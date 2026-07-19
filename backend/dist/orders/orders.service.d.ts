import type { Order } from './orders.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { PackagesService } from '../packages/packages.service';
export declare class OrdersService {
    private readonly packagesService;
    private orders;
    private nextId;
    constructor(packagesService: PackagesService);
    findAll(): Order[];
    findOne(id: string): Order | undefined;
    create(createOrderDto: CreateOrderDto): Order;
    updateStatus(id: string, status: 'Preparing' | 'Shipped' | 'Delivered'): Order | undefined;
}
