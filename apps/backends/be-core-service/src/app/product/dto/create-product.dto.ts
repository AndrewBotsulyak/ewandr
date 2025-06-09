import {
  IsEnum,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ProductStatusEnum } from '../models/product-status.enum';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2000)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  categoryId: number;
}
