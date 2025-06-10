import { Route } from '@angular/router';
import {ProductContainerComponent} from "../product-container/product-container.component";

export const remoteRoutes: Route[] = [
  { path: '', component: ProductContainerComponent },
];
