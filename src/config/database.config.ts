import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

export const rawConfigGetter = (): TypeOrmModuleOptions &
  DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [], // using SQL + query runners; add entities later if desired
  synchronize: false,
  logging: false,
});

export default registerAs('database', rawConfigGetter);
