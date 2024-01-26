import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from 'src/redis/redis-client.type';

@Injectable()
export class UserService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  async getUsers(): Promise<any> {
    return this.redis.ping();
  }
}
