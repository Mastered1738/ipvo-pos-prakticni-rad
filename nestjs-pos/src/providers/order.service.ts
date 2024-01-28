import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDTO } from 'src/dto/create_order.dto';
import { EndProductionDTO } from 'src/dto/end_production.dto';
import { ReadyForCustomerAcquisitionDTO } from 'src/dto/ready_for_customer.dto';
import { StartProductionOrderDTO } from 'src/dto/start_order.dto';
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

  async GetAllInProductionOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        status: StatusEnum.in_production,
      },
    });
  }

  async GetFinishedOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        status: StatusEnum.finished_production,
      },
    });
  }

  async GetReadyForCustomerOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        status: StatusEnum.ready_for_customer_acquisition,
      },
    });
  }

  async GetPaidOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        status: StatusEnum.ready_for_customer_acquisition,
      },
    });
  }

  async GetFinishedOrdersByProductionUserID(user_id: number): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: [
        'user_started_production',
        'user_made_order',
        'user_ended_production',
      ],
      where: {
        status: StatusEnum.finished_production,
        user_ended_production: {
          user_id: user_id,
        },
      },
      select: {
        order_id: true,
        ordered_at: true,
        olive_weight_kg: true,
        started_production_at: true,
        ended_production_at: true,
        user_made_order: {
          user_id: true,
          username: true,
          password: false,
        },
        user_started_production: {
          user_id: true,
          username: true,
          password: false,
        },
        user_ended_production: {
          user_id: true,
          username: true,
          password: false,
        },
        status: true,
      },
    });
  }

  async getAllWatingOrdersbyUserID(user_id: number): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: ['user_made_order'],
      where: {
        status: StatusEnum.waiting_for_produciton,
        user_made_order: {
          user_id: user_id,
        },
      },
      select: {
        order_id: true,
        ordered_at: true,
        olive_weight_kg: true,
        user_made_order: {
          user_id: true,
          username: true,
          password: false,
        },
        status: true,
      },
    });
  }

  async GetAllInProductionOrdersByProductionUserID(
    user_id: number,
  ): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: ['user_started_production', 'user_made_order'],
      where: {
        status: StatusEnum.waiting_for_produciton,
        user_started_production: {
          user_id: user_id,
        },
      },
      select: {
        order_id: true,
        ordered_at: true,
        olive_weight_kg: true,
        started_production_at: true,
        user_made_order: {
          user_id: true,
          username: true,
          password: false,
        },
        user_started_production: {
          user_id: true,
          username: true,
          password: false,
        },
        status: true,
      },
    });
  }

  async sumTodaysOliveWeight(): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return await this.orderRepo
      .createQueryBuilder('Order')
      .select('COALESCE(SUM(Order.olive_weight_kg), 0)', 'total')
      .where('Order.ordered_at BETWEEN :start AND :end', {
        start: todayStart.toISOString(),
        end: todayEnd.toISOString(),
      })
      .getRawOne()
      .then((result) => +result.total);
  }

  async sumTodaysOliveOilWeight(): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return await this.orderRepo
      .createQueryBuilder('Order')
      .select('COALESCE(SUM(Order.olive_oil_weight_kg), 0)', 'total')
      .where('Order.ordered_at BETWEEN :start AND :end', {
        start: todayStart.toISOString(),
        end: todayEnd.toISOString(),
      })
      .getRawOne()
      .then((result) => +result.total);
  }

  async getAverageOliveOilPercentageForToday(): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return await this.orderRepo
      .createQueryBuilder('Order')
      .select('COALESCE(AVG(Order.olive_oil_percentage), 0)', 'average')
      .where('Order.finished_at BETWEEN :start AND :end', {
        start: todayStart.toISOString(),
        end: todayEnd.toISOString(),
      })
      .getRawOne()
      .then((result) => +result.average);
  }

  async createOrder(createOrder: CreateOrderDTO): Promise<Order> {
    const order = this.orderRepo.create({
      olive_weight_kg: createOrder.olive_weight_kg,
      boxes: createOrder.boxes,
      user_made_order: {
        user_id: createOrder.user_made_order,
      },
      customer: {
        customer_id: createOrder.customer,
      },
      order_cost: createOrder.order_cost,
      customer_has_bottles: createOrder.customer_has_bottles,
    });

    await this.orderRepo.save(order);

    const waitingOrders = await this.getAllWatingOrders();

    this.cache.set('all-waiting-orders', waitingOrders);

    return order;
  }

  async startOrder(order: StartProductionOrderDTO): Promise<boolean> {
    await this.orderRepo.update(order.order_id, {
      started_production_at: new Date(),
      user_started_production: {
        user_id: order.user_started_production,
      },
      status: StatusEnum.in_production,
    });

    const productionOrders = await this.GetAllInProductionOrders();
    const waitingOrders = await this.getAllWatingOrders();

    this.cache.set('all-in-production-orders', productionOrders);
    this.cache.set('all-waiting-orders', waitingOrders);

    return true;
  }

  //end production of an order by order_id
  async endProductionByOrderId(order: EndProductionDTO): Promise<boolean> {
    await this.orderRepo.update(order.order_id, {
      ended_production_at: new Date(),
      user_ended_production: {
        user_id: order.user_id,
      },
      status: StatusEnum.finished_production,
    });

    const productionOrders = await this.GetAllInProductionOrders();
    const waitingOrders = await this.getAllWatingOrders();
    const allEndedOrders = await this.GetFinishedOrders();

    this.cache.set('all-in-production-orders', productionOrders);
    this.cache.set('all-waiting-orders', waitingOrders);
    this.cache.set('all-finished-orders', allEndedOrders);

    return true;
  }

  //update order to "ready for costumer acquisition" with needed values as well
  async readyForCustomerAcquisition(
    order: ReadyForCustomerAcquisitionDTO,
  ): Promise<boolean> {
    await this.orderRepo.update(order.order_id, {
      finished_at: new Date(),
      olive_oil_weight_kg: order.olive_oil_weight,
      olive_oil_percentage: order.olive_oil_percentage,
      user_finished_order: {
        user_id: order.user_id,
      },
      status: StatusEnum.ready_for_customer_acquisition,
    });

    const productionOrders = await this.GetAllInProductionOrders();
    const waitingOrders = await this.getAllWatingOrders();
    const allEndedOrders = await this.GetFinishedOrders();
    const readyForCustomerOrders = await this.GetReadyForCustomerOrders();

    this.cache.set('all-in-production-orders', productionOrders);
    this.cache.set('all-waiting-orders', waitingOrders);
    this.cache.set('all-finished-orders', allEndedOrders);
    this.cache.set('all-ready-for-customer-orders', readyForCustomerOrders);

    return true;
  }

  //update order to paid with needed values as well

  async getOrderByOrderID(order_id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: {
        order_id: order_id,
      },
      select: {
        order_id: true,
        ordered_at: true,
        olive_weight_kg: true,
        started_production_at: true,
      },
    });

    return order;
  }

  async GetAllOrdersByCustomerID(customer_id: number): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: ['customer'],
      where: {
        customer: {
          customer_id: customer_id,
        },
      },
      select: {
        order_id: true,
        ordered_at: true,
        olive_weight_kg: true,
        user_made_order: {
          user_id: true,
          username: true,
          password: false,
        },
        status: true,
      },
    });
  }
}
