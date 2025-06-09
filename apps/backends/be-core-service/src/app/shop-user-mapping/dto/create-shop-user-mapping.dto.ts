import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShopUserMappingDto } from './shop-user-mapping.dto';

export class CreateShopUserMappingDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShopUserMappingDto)
  shops: ShopUserMappingDto[];
}
