import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from './userType.entity';

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
}
