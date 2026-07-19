import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @CreateDateColumn()
  createdAt!: string;
}
