import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime'

export const appRoutes: Route[] = [
  {
    path: 'products',
    loadChildren: () => {
      return loadRemote('client_products/Routes')
        .then((m) => {
          console.log('m = ', m);
          // @ts-ignore
          return m!.remoteRoutes;
        })
    }
  },
];
