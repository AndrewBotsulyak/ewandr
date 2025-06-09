import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrganizationQueryService } from './organization-query/organization-query.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity]),
    forwardRef(() => ShopModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationQueryService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
