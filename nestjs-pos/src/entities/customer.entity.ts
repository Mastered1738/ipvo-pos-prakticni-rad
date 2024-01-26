import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'Customer' })
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column()
  name_surname: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  phone_number: string;

  @OneToMany(() => Order, (order) => order.customer)
  order: Order[];
}
