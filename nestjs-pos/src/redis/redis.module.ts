import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';
import { RedisService } from './redis.service';

@Module({
  controllers: [],
  providers: [redisClientFactory, RedisService],
  exports: [RedisService, redisClientFactory],
})
export class RedisModule {}
