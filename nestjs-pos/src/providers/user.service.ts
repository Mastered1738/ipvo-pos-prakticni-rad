import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cache: CacheStore,
  ) {}

  async createUser(user: User): Promise<User> {
    const newUser = await this.userRepo.create(user);

    this.cache.set(newUser.username, newUser);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }
}
