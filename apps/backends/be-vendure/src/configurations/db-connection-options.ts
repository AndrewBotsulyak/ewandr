import path from "path";
import {DataSourceOptions} from "typeorm";
import process from "node:process";

export const dbConnectionOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: true,
  logging: true,
  database: process.env.DB_NAME,
  // to run migrations locally NODE_ENV === 'local'
  host: process.env.NODE_ENV === 'local' ? 'localhost' : process.env.DB_HOST || 'postgres-vendure-db',  // В Docker используем имя сервиса
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
}
