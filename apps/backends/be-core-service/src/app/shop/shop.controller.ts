import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  async create(@Body() createShopDto: CreateShopDto) {
    return await this.shopService.create(createShopDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query('includeUsers') includeUsers: boolean) {
    return await this.shopService.findAll({ includeUsers });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.shopService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Param('id') id: number, @Body() updateShopDto: UpdateShopDto) {
    return await this.shopService.update(id, updateShopDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return await this.shopService.remove(id);
  }
}
