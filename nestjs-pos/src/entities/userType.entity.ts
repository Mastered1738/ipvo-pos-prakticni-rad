import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'UserType' })
export class UserType {
  @PrimaryGeneratedColumn()
  user_type_id: number;

  @Column()
  user_type_name: string;

  @OneToMany(() => User, (user) => user.user_type)
  user: User[];
}
