import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
