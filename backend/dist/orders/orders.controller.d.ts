import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("./order.entity").Order[]>;
    findByUserId(userId: string): Promise<import("./order.entity").Order[]>;
    findOne(id: string): Promise<import("./order.entity").Order | null>;
    create(createOrderDto: CreateOrderDto): Promise<import("./order.entity").Order>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./order.entity").Order | null>;
}
