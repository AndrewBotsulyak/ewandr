import { Route } from '@angular/router';
import {ProductContainerComponent} from "../product-container/product-container.component";
import {productContainerResolver} from "../product-container/resolvers/product-container.resolver";

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: ProductContainerComponent,
    resolve: { products: productContainerResolver},
  },
];
