import { GetUserDto } from '../dto/get-user.dto';
import { GetShopDto } from '../../shop/dto/get-shop.dto';
import { UserOrganizationRoleEnum } from '../../common/models/user-organization-role.enum';

export interface IUserItem extends GetUserDto {
  role: UserOrganizationRoleEnum;
  shops?: GetShopDto[];
}
