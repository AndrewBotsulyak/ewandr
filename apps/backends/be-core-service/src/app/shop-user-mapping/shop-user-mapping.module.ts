import { forwardRef, Module } from '@nestjs/common';
import { ShopUserMappingService } from './shop-user-mapping.service';
import { ShopUserMappingController } from './shop-user-mapping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopUserMappingEntity } from './entities/shop-user-mapping.entity';
import { UserModule } from '../user/user.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopUserMappingEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => ShopModule),
  ],
  controllers: [ShopUserMappingController],
  providers: [ShopUserMappingService],
  exports: [ShopUserMappingService],
})
export class ShopUserMappingModule {}
