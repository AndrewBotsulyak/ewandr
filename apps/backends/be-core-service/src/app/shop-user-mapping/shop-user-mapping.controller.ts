import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ShopUserMappingService } from './shop-user-mapping.service';
import { CreateShopUserMappingDto } from './dto/create-shop-user-mapping.dto';
import { ExcludeUsersShopFieldsInterceptor } from './utils/exclude-users-shop-fields.interceptor';
import { ExcludeShopsByUserFieldsInterceptor } from './utils/exclude-shops-by-user-fields.interceptor';
import { DeleteUserFromShopDto } from './dto/delete-user-from-shop.dto';

@Controller()
export class ShopUserMappingController {
  constructor(private readonly service: ShopUserMappingService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createShopUserMappingDto: CreateShopUserMappingDto) {
    return this.service.create(createShopUserMappingDto);
  }

  @Get('/:shopId/users')
  @UseInterceptors(ExcludeUsersShopFieldsInterceptor)
  getUsersByShop(@Param('shopId') shopId: number) {
    return this.service.getUsersByShop(shopId);
  }

  @Get('/:userId/shops')
  @UseInterceptors(ExcludeShopsByUserFieldsInterceptor)
  getShopsByUser(@Param('userId') userId: number) {
    return this.service.getShopsByUser(userId);
  }

  @Post('/users/:userId/shops/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserFromShops(
    @Param('userId') userId: number,
    @Body() deleteDto: DeleteUserFromShopDto,
  ) {
    return this.service.deleteUserFromShops(userId, deleteDto);
  }
  // @Get()
  // findAll() {
  //   return this.shopUserMappingService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.shopUserMappingService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateShopUserMappingDto: UpdateShopUserMappingDto) {
  //   return this.shopUserMappingService.update(+id, updateShopUserMappingDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.shopUserMappingService.remove(+id);
  // }
}
