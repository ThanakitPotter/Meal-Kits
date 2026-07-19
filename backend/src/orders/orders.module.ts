import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MenusModule } from '../menus/menus.module';
import { Order } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), MenusModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
