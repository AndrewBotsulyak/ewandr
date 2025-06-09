import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserShopRoleEnum } from '../../common/models/user-shop-role.enum';

export class ShopUserMappingDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsEnum(UserShopRoleEnum)
  role?: UserShopRoleEnum;
}
