import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { User } from 'src/entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-users')
  @CacheTTL(5000)
  @Get('/allUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
