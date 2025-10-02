import {computed, inject, Injectable, signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {GetProductQuery, GetProductQueryVariables, GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {ProductState} from "../models/product-state.model";

@Injectable()
export class ProductDetailsService {
  store = inject(Store);
  gqlService = inject(GqlDataService);

  productState = signal<ProductState>({
    selectedVariant: undefined,
    selectedOptions: {},
    quantity: 1,
    isInWishlist: false,
    activeTab: 'description'
  });

  isOptionSelected = computed(() => {
    return (optionGroupId: string, optionName: string) => {
      const state = this.productState();
      return state.selectedOptions[optionGroupId] === optionName;
    };
  });

  getProduct(slug: GetProductQueryVariables['slug']) {
    return this.gqlService.getProduct(slug);
  }
}
