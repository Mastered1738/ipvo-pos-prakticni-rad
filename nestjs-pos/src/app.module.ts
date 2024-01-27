import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './modules/product.module';
import { UserModule } from './modules/user.module';
import { OrderModule } from './modules/order.module';
import { CustomerModule } from './modules/customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        isGlobal: true,
        store: await redisStore({
          socket: {
            host: 'redis-pos',
            port: 6379,
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
