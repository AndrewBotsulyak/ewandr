import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppRoutingModule } from './app-routing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { OrganizationModule } from './organization/organization.module';
import { ShopModule } from './shop/shop.module';
import { OrganizationUserMappingModule } from './organization-user-mapping/organization-user-mapping.module';
import { ShopUserMappingModule } from './shop-user-mapping/shop-user-mapping.module';
import { ProductModule } from './product/product.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env.development'),
        join(__dirname, '../../.env.development'),
      ],
      isGlobal: true, // чтобы не импортировать в каждом модуле отдельно
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig(),
    }),
    AppRoutingModule,
    UserModule,
    OrganizationModule,
    ShopModule,
    OrganizationUserMappingModule,
    ShopUserMappingModule,
    ProductModule,
    ProductCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
