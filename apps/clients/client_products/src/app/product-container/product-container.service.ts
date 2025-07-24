import {inject, Injectable, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductsActions, selectAllProducts, selectIsLoading} from "@ewandr-workspace/ngrx-store";

@Injectable({
  providedIn: "root"
})
export class ProductContainerService {
  store = inject(Store);

  products$ = this.store.select(selectAllProducts);

  isLoading$ = this.store.select(selectIsLoading);

  getProducts() {
    this.store.dispatch(ProductsActions.getAllProducts());
  }
}
