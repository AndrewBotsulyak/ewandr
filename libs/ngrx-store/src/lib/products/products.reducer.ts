import {createFeature, createReducer, on} from '@ngrx/store';
import {ProductsActions} from './products.actions';
import {GetProductModel} from "@ewandr-workspace/core";

export const PRODUCTS_STATE_KEY = 'productsState';

export type ProductsState = {
  products: GetProductModel[] | null;
  isLoading: boolean;
  isLoaded: boolean; // this is detector that SSR loaded all required data
};

const initialState: ProductsState = {
  products: null,
  isLoading: false,
  isLoaded: false
};

const productsReducer = createReducer(
  initialState,

  on(ProductsActions.getAllProductsSuccess, (state, {data}) => {
    return {
      ...state,
      products: data,
      isLoaded: true, //temporary while I have only products
    };
  }),
);

export const productsFeatureStore = createFeature({
  name: PRODUCTS_STATE_KEY,
  reducer: productsReducer
});
