import { Route } from '@angular/router';
import {remoteRoutes} from "client_products/Routes";

export const appRoutes: Route[] = [
  {
    path: '',
    children: remoteRoutes
  },
];
