import { Module } from '@nestjs/common';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [MenusModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
