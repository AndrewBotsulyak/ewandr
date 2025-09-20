import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductsActions, selectAllProducts, selectIsLoading} from "@ewandr-workspace/ngrx-store";
import {GqlDataService, SearchInput} from "@ewandr-workspace/data-access-graphql";

@Injectable({
  providedIn: "any"
})
export class ProductContainerService {
  store = inject(Store);
  gqlService = inject(GqlDataService);
  destroyRef = inject(DestroyRef);

  // products$ = this.store.select(selectAllProducts);

  isLoading$ = this.store.select(selectIsLoading);

  constructor() {
    this.destroyRef.onDestroy(() => console.log('this.destroyRef.onDestroy'));
  }

  getProducts() {
    this.store.dispatch(ProductsActions.getAllProducts());
  }

  getGqlProducts() {
    return this.gqlService.getProducts();
  }

  searchProducts(searchInputs: SearchInput) {
    return this.gqlService.searchProducts(searchInputs);
  }
}
