import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {ProductsActions, selectAllProducts} from "@ewandr-workspace/ngrx-store";
import {API_URL_TOKEN} from "@ewandr-workspace/client-core";

@Injectable({
  providedIn: "root"
})
export class ProductContainerService {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL_TOKEN);
  activatedRoute = inject(ActivatedRoute);
  store = inject(Store);

  products$ = this.store.select(selectAllProducts);

  getProducts() {
    this.store.dispatch(ProductsActions.getAllProducts());
  }
}
