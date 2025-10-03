import {ProductVariant} from "./details-product-variant.model";
import {DetailsTab} from "./details-tab.model";


export type SelectedVariantT = ProductVariant | undefined;

export interface ProductState {
  selectedVariant: SelectedVariantT;
  selectedOptions: string[];
  quantity: number;
  isInWishlist: boolean;
  activeTab: DetailsTab;
}
