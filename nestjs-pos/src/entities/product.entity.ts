import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from './productType.entity';

@Entity({ name: 'Product' })
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  product_availability: number;

  @Column()
  cost: number;

  @ManyToOne(() => ProductType, (productType) => productType.products)
  @JoinColumn({
    name: 'product_type_id',
    referencedColumnName: 'product_type_id',
  })
  product_type: ProductType;
}
