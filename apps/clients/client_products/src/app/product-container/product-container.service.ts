import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductsActions, selectAllProducts, selectIsLoading} from "@ewandr-workspace/ngrx-store";
import {ProductsService} from "@ewandr-workspace/data-access-graphql";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: "any"
})
export class ProductContainerService {
  store = inject(Store);
  gqlService = inject(ProductsService);
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
}
