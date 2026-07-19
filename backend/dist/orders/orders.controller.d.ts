import type { Order } from './orders.interface';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Order[];
    findOne(id: string): Order | undefined;
    create(createOrderDto: CreateOrderDto): Order;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Order | undefined;
}
