import { Route } from '@angular/router';
import { FeatureHomePageComponent } from '@ewandr-workspace/feature-home-page';
import { RoutesConstants } from '@ewandr-workspace/core';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: FeatureHomePageComponent,
  },
  {
    path: `${RoutesConstants.PRODUCT}/:slug`,
    loadChildren: () =>
      import('client_product_details/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: RoutesConstants.CATEGORY,
    loadChildren: () =>
      import('client_products/Routes').then((m) => m!.remoteRoutes),
  },
];
