import {
  Body, ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put, Query, UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { IUsersByQuery } from './models/users-by-query.model';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUser(@Param('id') userId: number): Promise<GetUserDto | null> {
    return await this.service.getUserById(userId);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query('includeShops') includeShops: boolean) {
    return await this.service.findAll({ includeShops });
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<any> {
    return await this.service.createUser(dto);
  }

  @Put(':id')
  update(@Param('id') userId: number, @Body() dto: UpdateUserDto): any {
    return this.service.updateUser(userId, dto);
  }
}
