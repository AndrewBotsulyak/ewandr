import { Route } from '@angular/router';
import { FeatureHomePageComponent } from '@ewandr-workspace/feature-home-page';
import { RoutesConstants } from '@ewandr-workspace/core';
import {remoteRoutes as categoryRoutes} from "client_products/Routes";

export const appRoutes: Route[] = [
  {
    path: '',
    children: categoryRoutes
  },
  {
    path: `${RoutesConstants.PRODUCT}/:slug`,
    loadChildren: () =>
      import('client_product_details/Routes').then((m) => m!.remoteRoutes),
  },
];
