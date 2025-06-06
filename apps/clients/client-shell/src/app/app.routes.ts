import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'products',
    loadChildren: () =>
      import('client_products/Routes').then((m) => m!.remoteRoutes),
  },
];
