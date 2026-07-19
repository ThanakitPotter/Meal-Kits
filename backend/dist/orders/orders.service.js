"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const menus_service_1 = require("../menus/menus.service");
let OrdersService = class OrdersService {
    ordersRepository;
    menusService;
    constructor(ordersRepository, menusService) {
        this.ordersRepository = ordersRepository;
        this.menusService = menusService;
    }
    findAll() {
        return this.ordersRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    findByUserId(userId) {
        return this.ordersRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    findOne(id) {
        return this.ordersRepository.findOne({ where: { id } });
    }
    async create(createOrderDto) {
        const menu = await this.menusService.findOne(createOrderDto.menuId);
        const basePrice = menu?.price ?? 0;
        const totalPrice = createOrderDto.servings === 2
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
    async updateStatus(id, status) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (order) {
            order.status = status;
            return this.ordersRepository.save(order);
        }
        return null;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        menus_service_1.MenusService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map