import { forwardRef, Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopEntity } from './entities/shop.entity';
import { ShopUserMappingModule } from '../shop-user-mapping/shop-user-mapping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopEntity]),
    forwardRef(() => ShopUserMappingModule),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
