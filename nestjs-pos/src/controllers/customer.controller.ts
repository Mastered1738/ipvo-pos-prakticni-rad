import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { NameSurnameDTO } from 'src/dto/name_surname.dto';
import { Customer } from 'src/entities/customer.entity';
import { CustomerService } from 'src/providers/customer.service';

@Controller('/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/get-all-customers')
  @CacheKey('all-customers')
  @CacheTTL(60000)
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.getAllCustomers();
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/get-customers-by-name')
  @CacheKey('customers-by-name')
  @CacheTTL(60000)
  async getCustomerByName(
    @Body() name_surname: NameSurnameDTO,
  ): Promise<Customer[]> {
    return this.customerService.getCustomerByName(name_surname.name_surname);
  }
}
