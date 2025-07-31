import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetProductDocument,
  GetProductQuery,
  GetProductsDocument,
  GetProductsQuery,
  ProductListOptions,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apollo: Apollo) {}

  getProducts(options?: ProductListOptions): Observable<GetProductsQuery['products']> {
    return this.apollo
      .watchQuery<GetProductsQuery>({
        query: GetProductsDocument,
        variables: { options },
      })
      .valueChanges.pipe(map(result => result.data.products));
  }

  getProduct(id: string): Observable<GetProductQuery['product']> {
    return this.apollo
      .query<GetProductQuery>({
        query: GetProductDocument,
        variables: { id },
      })
      .pipe(map(result => result.data.product));
  }
}
