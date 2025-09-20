import {inject, Injectable} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetCollectionQuery, GetCollectionQueryVariables,
  GetCollectionsQuery,
  GetCollectionsQueryVariables,
  GetProductDocument,
  GetProductQuery,
  GetProductsDocument,
  GetProductsQuery,
  ProductListOptions, SearchInput, SearchProductsGQL, SearchProductsQuery, SearchProductsQueryVariables, SearchResult,
} from '../generated/graphql';
import {DataService} from "./data.service";
import {arrayToTree, RootNode} from "../utils/array-to-tree";
import {GET_COLLECTION, GET_COLLECTIONS} from "../operations/collections/collections.graphql";
import {SEARCH_PRODUCTS} from "../operations/products/search-products.graphql";

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
        fetchPolicy: "cache-first"
      })
      .valueChanges.pipe(map(result => result.data.products));
  }

  searchProducts(searchInputs?: SearchInput): Observable<SearchProductsQuery['search']> {
    return this.dataService.query<SearchProductsQuery, SearchProductsQueryVariables>(
      SEARCH_PRODUCTS, {
        input: {
          groupByProduct: true,
          ...searchInputs
        }
      }
    ).pipe(
      map(data => data.search),
    );
  }

  getProduct(slug: string): Observable<GetProductQuery['product']> {
    return this.apollo
      .query<GetProductQuery>({
        query: GetProductDocument,
        variables: { slug },
        fetchPolicy: "cache-first"
      })
      .pipe(map(result => result.data.product));
  }

  // endregion

  // region Collections

  getCollections(): Observable<RootNode<CollectionItem>> {
    return this.dataService.query<GetCollectionsQuery, GetCollectionsQueryVariables>(GET_COLLECTIONS, {
      options: {
        take: 50
      },
    }).pipe(
      map(data => arrayToTree(data.collections.items)),
    );
  }

  getCollection(variables: {slug: string}): Observable<GetCollectionQuery['collection']> {
    return this.dataService.query<GetCollectionQuery, GetCollectionQueryVariables>(
      GET_COLLECTION,
      variables
    ).pipe(
      map(data => data.collection),
    );
  }

  //endregion
}
