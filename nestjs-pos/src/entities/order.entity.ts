import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Customer } from './customer.entity';

@Entity({ name: 'Order' })
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  ordered_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  started_production_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  ended_production_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  finished_at: Date;

  @Column()
  olive_weight_kg: number;

  @Column()
  olive_oil_weight_kg: number;

  @Column()
  olive_oil_percentage: number;

  @Column()
  boxes: string;

  @ManyToOne(() => User, (user) => user.user_started_order)
  @JoinColumn({
    name: 'user_made_order',
    referencedColumnName: 'user_id',
  })
  user_made_order: User;

  @ManyToOne(() => User, (user) => user.started_production_order)
  @JoinColumn({
    name: 'user_started_production',
    referencedColumnName: 'user_id',
  })
  user_started_production: User;

  @ManyToOne(() => User, (user) => user.ended_production_order)
  @JoinColumn({
    name: 'user_ended_production',
    referencedColumnName: 'user_id',
  })
  user_ended_production: User;

  @ManyToOne(() => User, (user) => user.finished_order)
  @JoinColumn({
    name: 'user_finished_order',
    referencedColumnName: 'user_id',
  })
  user_finished_order: User;

  @ManyToOne(() => Customer, (customer) => customer.order)
  @JoinColumn({
    name: 'customer',
    referencedColumnName: 'customer_id',
  })
  customer: Customer;

  @Column()
  order_cost: number;

  @Column()
  customer_has_bottles: boolean;
}
