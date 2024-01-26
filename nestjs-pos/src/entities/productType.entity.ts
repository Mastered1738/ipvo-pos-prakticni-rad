import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'ProductType' })
export class ProductType {
  @PrimaryGeneratedColumn()
  product_type_id: number;

  @Column()
  product_type_name: string;

  @OneToMany(() => Product, (product) => product.product_type)
  products: Product[];
}
