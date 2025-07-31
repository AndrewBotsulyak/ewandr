import {inject, Injectable, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductsActions, selectAllProducts, selectIsLoading} from "@ewandr-workspace/ngrx-store";
import {ProductsService} from "@ewandr-workspace/data-access-graphql";

@Injectable({
  providedIn: "root"
})
export class ProductContainerService {
  store = inject(Store);
  gqlService = inject(ProductsService);

  // products$ = this.store.select(selectAllProducts);

  isLoading$ = this.store.select(selectIsLoading);

  getProducts() {
    this.store.dispatch(ProductsActions.getAllProducts());
  }

  getGqlProducts() {
    return this.gqlService.getProducts();
  }
}
