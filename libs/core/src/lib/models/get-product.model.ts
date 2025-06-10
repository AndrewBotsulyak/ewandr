import {ProductStatusEnum} from "./product-status.enum";

export interface GetProductModel {
  id: number;
  shopId: number;
  categoryId: number;
  title: string;
  description: string;
  price: number;
  status: ProductStatusEnum;
  count: number;
  brand: string;
}
