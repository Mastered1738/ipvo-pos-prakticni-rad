import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cache: CacheStore,
  ) {}

  async createUser(user: UserDTO): Promise<User> {
    const newUser = this.userRepo.create({
      username: user.username,
      password: user.password,
      user_type: {
        user_type_id: user.user_type,
      },
    });

    await this.userRepo.save(newUser);

    const allUsers = await this.getAllUsers();

    this.cache.set('all-users', allUsers);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }
}
