import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { Order } from 'src/entities/order.entity';
import { OrderService } from 'src/providers/order.service';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseInterceptors(CacheInterceptor)
  @Post('/get-waiting-orders')
  @CacheKey('all-waiting-orders')
  @CacheTTL(60000)
  async getAllWaitingOrders(): Promise<Order[]> {
    return this.orderService.getAllWatingOrders();
  }
}
