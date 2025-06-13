import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ProductsActions} from './products.actions';
import {catchError, exhaustMap, map, of} from 'rxjs';
import {HttpToApiService} from "@ewandr-workspace/client-core";

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(HttpToApiService);

  loadCurrentProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.getAllProducts),
      exhaustMap(() => {
        return this.api.products.getAll();
      }),
      map((data) => {
        return ProductsActions.getAllProductsSuccess({ data });
      }),
      catchError((err) => {
        return of(ProductsActions.getAllProductsFailure(new Error(err)));
      }),
    );
  });
}
