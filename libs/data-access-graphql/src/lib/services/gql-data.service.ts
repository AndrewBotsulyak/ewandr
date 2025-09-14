import {inject, Injectable} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetCollectionsQuery,
  GetCollectionsQueryVariables,
  GetProductDocument,
  GetProductQuery,
  GetProductsDocument,
  GetProductsQuery,
  ProductListOptions,
} from '../generated/graphql';
import {GET_COLLECTIONS} from "../operations/common/documents.graphql";
import {DataService} from "./data.service";
import {arrayToTree, RootNode} from "../utils/array-to-tree";

type CollectionItem = GetCollectionsQuery['collections']['items'][number];

@Injectable({
  providedIn: 'root',
})
export class GqlDataService {
  private apollo = inject(Apollo);
  private dataService = inject(DataService);

  // region Product / Products

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

  // endregion

  // region Collections

  getCollections(options?: GetCollectionsQueryVariables): Observable<RootNode<CollectionItem>> {
    return this.dataService.query<GetCollectionsQuery, GetCollectionsQueryVariables>(GET_COLLECTIONS, {
      options: {
        take: 50,
        ...options
      }
    }).pipe(
      map(data => arrayToTree(data.collections.items)),
    );
  }

  //endregion
}
