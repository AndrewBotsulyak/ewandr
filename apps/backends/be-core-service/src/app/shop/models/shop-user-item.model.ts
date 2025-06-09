import { GetUserDto } from '../../user/dto/get-user.dto';
import { UserShopRoleEnum } from '../../common/models/user-shop-role.enum';

export interface IShopUserItemModel extends GetUserDto {
  role: UserShopRoleEnum;
}