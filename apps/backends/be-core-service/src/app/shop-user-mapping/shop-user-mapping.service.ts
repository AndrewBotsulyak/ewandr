import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopUserMappingDto } from './dto/create-shop-user-mapping.dto';
import { UpdateShopUserMappingDto } from './dto/update-shop-user-mapping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopUserMappingEntity } from './entities/shop-user-mapping.entity';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ShopService } from '../shop/shop.service';
import { queryFailedErrorHandler } from '../common/utils/query-failed-error.handler';
import { DeleteUserFromShopDto } from './dto/delete-user-from-shop.dto';
import { CreateEntityShopUserMappingDto } from './dto/create-entity-shop-user-mapping.dto';
import { ORG_ID_CONTEXT } from '../common/models/test-values.temporary';

@Injectable()
export class ShopUserMappingService {
  constructor(
    @InjectRepository(ShopUserMappingEntity)
    private repository: Repository<ShopUserMappingEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ShopService))
    private shopService: ShopService,
  ) {}

  async create(createShopUserMappingDto: CreateShopUserMappingDto) {
    try {
      const { userId, shops } = createShopUserMappingDto;

      const user = await this.userService.getUserById(userId);
      const shopIds = shops.map((shop) => shop.id);

      const foundShops = await this.shopService.findByIds(shopIds);

      console.log('foundShops = ', foundShops);

      if (user == null || foundShops.length !== shopIds.length) {
        throw new NotFoundException(`User or some shop don't exist`);
      }

      const createDto: CreateEntityShopUserMappingDto[] = shops.map((shop) => {
        return {
          userId,
          shopId: shop.id,
          role: shop.role,
        };
      });

      const mappingEntity: ShopUserMappingEntity[] = this.repository.create(createDto);

      await this.repository.insert(mappingEntity);

      return await this.repository.findBy({
        userId,
        shopId: In(shopIds),
      });
    } catch (error) {
      queryFailedErrorHandler(error);

      throw error;
    }
  }

  async deleteUserFromShops(userId: number, dto: DeleteUserFromShopDto) {
    try {
      const { shopIds } = dto;

      await this.repository.delete({
        userId,
        shopId: In(shopIds),
      });
    } catch (error) {
      console.log('deleteUserFromShop error = ', error);

      throw error;
    }

    return;
  }

  async getUsersByShop(shopId: number) {
    const shopEntity = await this.shopService.findOne(shopId);

    if (shopEntity == null) {
      throw new NotFoundException('No such shop');
    }

    const result = await this.repository.find({
      where: { shopId },
      relations: ['user'],
    });

    return result;
  }

  async getShopsByUser(userId: number) {
    const userEntity = await this.userService.getUserById(userId);

    if (userEntity == null) {
      throw new NotFoundException('No such user');
    }

    const result = await this.repository.find({
      where: { userId },
      relations: ['shop'],
    });

    return result;
  }

  // async getShopUserMapping(shopIds: number[]) {
  //   // TODO organization context
  //   const orgId = ORG_ID_CONTEXT;
  //
  //   const mappingEtities = await this.repository.find({
  //     relations: ['user', 'shop'],
  //     where: { shopId: In(shopIds) },
  //   });
  //
  //   console.log('mappingEtities = ', mappingEtities);
  //
  //   if (mappingEtities.length !== shopIds.length) {
  //     throw new NotFoundException(`Some of shop user mapping doesn't exist`);
  //   }
  //
  //   return mappingEtities;
  // }

  // findAll() {
  //   return `This action returns all shopUserMapping`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} shopUserMapping`;
  // }
  //
  // update(id: number, updateShopUserMappingDto: UpdateShopUserMappingDto) {
  //   return `This action updates a #${id} shopUserMapping`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} shopUserMapping`;
  // }
}
