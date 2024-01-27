import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { StatusEnum } from 'src/enum/status_enum.type';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @Inject(CACHE_MANAGER) private cache: CacheStore,
  ) {}

  async getAllWatingOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        status: StatusEnum.waiting_for_produciton,
      },
    });
  }
}
