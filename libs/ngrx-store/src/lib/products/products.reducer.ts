import {createFeature, createReducer, on} from '@ngrx/store';
import {ProductsActions} from './products.actions';
import {GetProductModel} from "@ewandr-workspace/core";

export const PRODUCTS_STATE_KEY = 'productsState';

export type ProductsState = {
  products: GetProductModel[] | null;
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: null,
  isLoading: false,
};

const productsReducer = createReducer(
  initialState,

  on(ProductsActions.getAllProductsSuccess, (state, {data}) => {
    return {
      ...state,
      products: data,
    };
  }),
);

export const productsFeatureStore = createFeature({
  name: PRODUCTS_STATE_KEY,
  reducer: productsReducer
});
