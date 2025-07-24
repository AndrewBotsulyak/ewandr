import {createFeature, createReducer, on} from '@ngrx/store';
import {ProductActions, ProductsActions} from './products.actions';
import {GetProductModel} from "@ewandr-workspace/core";

export const PRODUCTS_STATE_KEY = 'productsState';

export type ProductsState = {
  products: GetProductModel[] | null;
  selectedProduct: GetProductModel | null;
  isLoading: boolean;
  isLoaded: boolean; // this is detector that SSR loaded all required data
};

const initialState: ProductsState = {
  products: null,
  isLoading: false,
  isLoaded: false,
  selectedProduct: null,
};

const productsReducer = createReducer(
  initialState,

  on(ProductsActions.getAllProducts, (state) => {
    return {
      ...state,
      isLoaded: false,
      isLoading: true,
    };
  }),

  on(ProductsActions.getAllProductsSuccess, (state, {data}) => {
    return {
      ...state,
      products: data,
      isLoaded: true,
      isLoading: false,
    };
  }),

  on(ProductsActions.getAllProductsFailure, (state) => {
    return {
      ...state,
      isLoaded: true,
      isLoading: false,
    };
  }),

  on(ProductActions.getProduct, (state) => {
    return {
      ...state,
      isLoading: true,
      isLoaded: false,
    };
  }),

  on(ProductActions.getProductSuccess, (state, {data}) => {
    return {
      ...state,
      selectedProduct: data,
      isLoading: false,
      isLoaded: true,
    };
  }),

  on(ProductActions.getProductFailure, (state) => {
    return {
      ...state,
      isLoading: true,
      isLoaded: true,
    };
  }),

);

export const productsFeatureStore = createFeature({
  name: PRODUCTS_STATE_KEY,
  reducer: productsReducer
});
