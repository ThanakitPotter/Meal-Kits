import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  menuId!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  menuName!: string;

  @Column()
  customerName!: string;

  @Column()
  customerPhone!: string;

  @Column('text')
  shippingAddress!: string;

  @Column('int')
  servings!: 1 | 2;

  @Column()
  status!: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว';

  @Column('int')
  totalPrice!: number;

  @CreateDateColumn()
  createdAt!: string;
}
