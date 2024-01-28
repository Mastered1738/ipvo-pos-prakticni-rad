import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @Inject(CACHE_MANAGER) private cache: CacheStore,
  ) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepo.find();
  }

  async getCustomerByName(name_surname: string): Promise<Customer[]> {
    return this.customerRepo.find({
      where: {
        name_surname: name_surname,
      },
    });
  }
}
