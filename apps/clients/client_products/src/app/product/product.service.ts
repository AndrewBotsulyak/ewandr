import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ProductActions, ProductsActions, selectedProduct} from "@ewandr-workspace/ngrx-store";
import {GetProductModel} from "@ewandr-workspace/core";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  store = inject(Store);

  selectedProduct$ = this.store.select(selectedProduct);

  getProduct(id: GetProductModel['id']) {
    this.store.dispatch(ProductActions.getProduct({id}));
  }
}
