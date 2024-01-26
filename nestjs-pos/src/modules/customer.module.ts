import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from 'src/controllers/customer.controller';
import { Customer } from 'src/entities/customer.entity';
import { CustomerService } from 'src/providers/customer.service';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
