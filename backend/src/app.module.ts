import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { Menu } from './menus/menu.entity';
import { Order } from './orders/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Menu, Order],
        synchronize: true, // Note: Set to false in production
        ssl: true, // Required for Supabase and most managed Postgres providers
        extra: {
          ssl: {
            rejectUnauthorized: false, // Optional: if encountering self-signed cert issues
          },
        },
      }),
      inject: [ConfigService],
    }),
    MenusModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
