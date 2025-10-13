import { Route } from '@angular/router';
import { RoutesConstants } from '@ewandr-workspace/core';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('client_products/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: `${RoutesConstants.PRODUCT}/:slug`,
    loadChildren: () =>
      import('client_product_details/Routes').then((m) => m!.remoteRoutes),
  },
];
