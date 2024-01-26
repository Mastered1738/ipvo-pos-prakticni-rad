import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'torac-postgres-do-user-15667509-0.c.db.ondigitalocean.com',
  port: 25060,
  username: 'doadmin',
  password: 'AVNS_rCGhkN4b1KFbseXTArU',
  database: 'defaultdb',
  schema: 'insight',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
