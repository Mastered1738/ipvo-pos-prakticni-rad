import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {}

  ping() {
    return this.redis.ping();
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
