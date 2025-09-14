import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ProductActions, ProductsActions, selectedProduct} from "@ewandr-workspace/ngrx-store";
import {GetProductModel} from "@ewandr-workspace/core";
import {GetProductQuery, GetProductQueryVariables, GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {map} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  store = inject(Store);
  gqlService = inject(GqlDataService);

  selectedProduct$ = this.store.select(selectedProduct);

  // getProduct(id: GetProductModel['id']) {
  //   this.store.dispatch(ProductActions.getProduct({id}));
  // }
  //
  getProduct(id: GetProductQueryVariables['id']) {
    return this.gqlService.getProduct(id);
  }
}
