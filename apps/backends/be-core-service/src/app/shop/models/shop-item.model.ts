import { IShopUserItemModel } from './shop-user-item.model';
import { GetShopDto } from '../dto/get-shop.dto';

export interface IShopItemModel extends GetShopDto {
  users?: IShopUserItemModel[];
}
