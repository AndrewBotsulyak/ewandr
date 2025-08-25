import { Route } from '@angular/router';
import {ProductContainerComponent} from "../product-container/product-container.component";
import {productContainerResolver} from "../product-container/resolvers/product-container.resolver";
import {ProductComponent} from "../product/product.component";

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: ProductContainerComponent,
    resolve: { products: productContainerResolver},
  },
  {
    path: ':productId',
    component: ProductComponent,
  }
];
