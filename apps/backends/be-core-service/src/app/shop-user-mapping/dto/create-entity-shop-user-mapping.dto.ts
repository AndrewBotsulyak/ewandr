import {
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { UserShopRoleEnum } from '../../common/models/user-shop-role.enum';

export class CreateEntityShopUserMappingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  shopId: number;

  @IsOptional()
  @IsEnum(UserShopRoleEnum)
  role?: UserShopRoleEnum;
}
