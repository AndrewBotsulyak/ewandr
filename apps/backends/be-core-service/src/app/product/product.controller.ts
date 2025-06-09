import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductQueryDto } from './dto/create-product-query.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @Query() query: CreateProductQueryDto,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto, query);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Patch('/products/category')
  updateProductsCategory(@Body() body: UpdateProductsCategoryDto) {
    return this.productService.updateCategory(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
