import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PRODUCTS_STATE_KEY, ProductsState} from './products.reducer';

const selectProductsState = createFeatureSelector<ProductsState>(PRODUCTS_STATE_KEY)

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.products,
);

export const selectedProduct = createSelector(
  selectProductsState,
  (state) => state.selectedProduct,
);

export const selectIsLoading = createSelector(
  selectProductsState,
  (state) => state.isLoading,
);
