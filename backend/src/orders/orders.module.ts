import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [MenusModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
