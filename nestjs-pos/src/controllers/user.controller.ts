import { Controller, Get } from '@nestjs/common';
import { UserService } from '../providers/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/ping')
  async ping(): Promise<any> {
    return this.userService.getUsers();
  }
}
