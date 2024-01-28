import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrderDTO } from 'src/dto/create_order.dto';
import { StartProductionOrderDTO } from 'src/dto/start_order.dto';
import { UserIdDTO } from 'src/dto/user_id.dto';
import { Order } from 'src/entities/order.entity';
import { OrderService } from 'src/providers/order.service';
import { get_order_by_id_DTO } from 'src/dto/get_order_by_id.dto';
import { customer_id_DTO } from 'src/dto/customer_id.dto';
import { DailyMetricDTO } from 'src/dto/daily_metric.dto';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/get-waiting-orders')
  @CacheKey('all-waiting-orders')
  @CacheTTL(60000)
  async getAllWaitingOrders(): Promise<Order[]> {
    return this.orderService.getAllWatingOrders();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/get-in-production-orders')
  @CacheKey('all-in-production-orders')
  @CacheTTL(60000)
  async GetAllInProductionOrders(): Promise<Order[]> {
    return this.orderService.GetAllInProductionOrders();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/get-finished-orders')
  @CacheKey('all-in-production-orders')
  @CacheTTL(60000)
  async GetAllFinishedOrders(): Promise<Order[]> {
    return this.orderService.GetFinishedOrders();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/get-all-ready-for-customer-orders')
  @CacheKey('all-ready-for-customer-orders')
  @CacheTTL(60000)
  async GetAllReadyForCustomerOrders(): Promise<Order[]> {
    return this.orderService.GetReadyForCustomerOrders();
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/get-finished-orders-by-production-user-id')
  @CacheKey('finished-orders-by-production-user-id')
  @CacheTTL(60000)
  async GetFinishedOrdersByProductionUserID(
    @Body() user: UserIdDTO,
  ): Promise<Order[]> {
    return this.orderService.GetFinishedOrdersByProductionUserID(user.user_id);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('today-olive-weight-sum')
  @CacheTTL(60000)
  @Get('/sum-todays-olive-weight')
  async sumTodaysOliveWeight(): Promise<number> {
    return this.orderService.sumTodaysOliveWeight();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('today-olive-oil-weight-sum')
  @CacheTTL(60000)
  @Get('/sum-todays-olive-oil-weight')
  async sumTodaysOliveOilWeight(): Promise<number> {
    return this.orderService.sumTodaysOliveWeight();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('today-olive-oil-percentage-average')
  @CacheTTL(60000)
  @Get('/average-todays-olive-oil-percentage')
  async getAverageOliveOilPercentageForToday(): Promise<number> {
    return this.orderService.getAverageOliveOilPercentageForToday();
  }

  @Post('/create-order')
  async createOrder(@Body() newOrder: CreateOrderDTO): Promise<Order> {
    return this.orderService.createOrder(newOrder);
  }

  @Put('/update-order')
  async updateOrder(
    @Body() newOrder: StartProductionOrderDTO,
  ): Promise<boolean> {
    return this.orderService.startOrder(newOrder);
  }

  @Post('/get-order-by-order-id')
  async getOrderByOrderID(@Body() order: get_order_by_id_DTO): Promise<Order> {
    return this.orderService.getOrderByOrderID(order.order_id);
  }

  @Post('/get-all-orders-by-customer-id')
  async GetAllOrdersByCustomerID(
    @Body() customer: customer_id_DTO,
  ): Promise<Order[]> {
    return this.orderService.GetAllOrdersByCustomerID(customer.customer_id);
  }

  @Post('/daily_metrics')
  async getDailyMetrics(): Promise<any> {
    const dailyMetrics: DailyMetricDTO = {
      total_processed_olives: await this.orderService.sumTodaysOliveWeight(),
      total_oil_made: await this.orderService.sumTodaysOliveOilWeight(),
      analyzed_at_time: new Date(),
      avarage_oil_percentage:
        await this.orderService.getAverageOliveOilPercentageForToday(),
    };

    return dailyMetrics;
  }
}
