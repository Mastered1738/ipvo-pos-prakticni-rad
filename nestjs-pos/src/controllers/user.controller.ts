import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { User } from 'src/entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UserDTO } from 'src/dto/user.dto';
import { LogInDTO } from 'src/dto/log_in.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-users')
  @CacheTTL(60000)
  @Get('/allUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('/create-user')
  async createUser(@Body() user: UserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('/get-user-by-username')
  async getUserByUsername(@Body() username: string): Promise<User> {
    return this.userService.getUserByUsername(username);
  }

  @Post('/log-in')
  async logInUser(@Body() loginInfo: LogInDTO): Promise<User> {
    return this.userService.logInUser(loginInfo);
  }
}
