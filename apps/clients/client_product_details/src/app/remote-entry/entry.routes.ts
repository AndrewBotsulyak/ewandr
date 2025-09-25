import { Route } from '@angular/router';
import {ProductDetailsComponent} from "../product-details/product-details.component";

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: ProductDetailsComponent
  }
];
