import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column('text')
  description!: string;

  @Column('int')
  price!: number;

  @Column()
  image!: string;

  @Column()
  prepTime!: string;

  @Column('jsonb')
  ingredients!: string[];

  @Column()
  category!: 'ผัด' | 'ต้ม-แกง' | 'ทอด-ย่าง';

  @Column({ default: true })
  isActive!: boolean;
}
