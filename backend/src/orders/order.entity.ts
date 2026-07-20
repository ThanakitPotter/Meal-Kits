import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn('varchar')
  id!: string;

  @Column({ default: 'one-time' })
  orderType!: 'subscription' | 'one-time';

  @Column({ nullable: true })
  deliveryFrequency?: string;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  items!: { menuId: string, menuName: string, servings: number, price: number, quantity: number }[];

  @Column({ nullable: true })
  userId?: string;

  @Column()
  customerName!: string;

  @Column()
  customerPhone!: string;

  @Column('text')
  shippingAddress!: string;

  @Column()
  status!: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว';

  @Column('int')
  totalPrice!: number;

  @Column({ default: false })
  isReviewed!: boolean;

  @CreateDateColumn()
  createdAt!: string;
}
