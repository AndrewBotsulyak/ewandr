import {ProductVariant} from "./details-product-variant.model";
import {DetailsTab} from "./details-tab.model";


export type SelectedVariantT = ProductVariant | undefined;

export interface SelectedOptionI {
  [key: string]: string
}

export interface ProductState {
  selectedVariant: SelectedVariantT;
  selectedOptions: SelectedOptionI;
  quantity: number;
  isInWishlist: boolean;
  activeTab: DetailsTab;
}
