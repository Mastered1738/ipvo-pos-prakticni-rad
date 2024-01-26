import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from './userType.entity';
import { Order } from './order.entity';
@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => UserType)
  @JoinColumn({
    name: 'user_type',
    referencedColumnName: 'user_type_id',
  })
  user_type: UserType;

  @OneToMany(() => Order, (order) => order.user_made_order)
  user_started_order: Order[];

  @OneToMany(() => Order, (order) => order.user_started_production)
  started_production_order: Order[];

  @OneToMany(() => Order, (order) => order.user_ended_production)
  ended_production_order: Order[];

  @OneToMany(() => Order, (order) => order.user_finished_order)
  finished_order: Order[];
}
