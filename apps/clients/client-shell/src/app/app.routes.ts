import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime'
import {FeatureHomePageComponent} from "@ewandr-workspace/feature-home-page";
import {RoutesConstants} from "@ewandr-workspace/core";

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: "full",
    component: FeatureHomePageComponent
  },
  {
    path: RoutesConstants.CATEGORY,
    loadChildren: () => {
      return loadRemote('client_products/Routes')
        .then((m) => {
          // @ts-ignore
          return m!.remoteRoutes;
        })
    }
  },
];
