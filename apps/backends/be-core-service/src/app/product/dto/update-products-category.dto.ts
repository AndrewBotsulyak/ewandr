import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductsCategoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  productIds: number[];

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
