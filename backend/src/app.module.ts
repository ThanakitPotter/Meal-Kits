import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PackagesModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
