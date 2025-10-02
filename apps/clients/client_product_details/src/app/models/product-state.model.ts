import {ProductVariant} from "./details-product-variant.model";


export interface ProductState {
  selectedVariant: ProductVariant | undefined;
  selectedOptions: SelectedOptions;
  quantity: number;
  isInWishlist: boolean;
  activeTab: 'description' | 'specifications' | 'reviews';
}

interface SelectedOptions {
  [optionGroupId: string]: string;
}
