import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {GetProductModel} from "@ewandr-workspace/core";

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Get All Products': emptyProps(),
    'Get All Products Success': props<{data: GetProductModel[]}>(),
    'Get All Products Failure': props<Error>(),
  },
});
