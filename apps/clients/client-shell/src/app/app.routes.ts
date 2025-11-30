import { Route } from '@angular/router';
import {RemoteNames, RoutesConstants} from '@ewandr-workspace/core';
import {loadRemote} from "@module-federation/enhanced/runtime";
import {mfRegisterRemote} from "../mf-register-remote";

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: async () => {
      const remoteName = RemoteNames.CLIENT_PRODUCTS;
      const remoteModule = `${remoteName}/Routes`;

      mfRegisterRemote(remoteName);

      return loadRemote<typeof import('client_products/Routes')>(remoteModule).then(
        (m) => m!.remoteRoutes
      )
    },
  },
  {
    path: `${RoutesConstants.PRODUCT}/:slug`,
    loadChildren: async () => {
      const remoteName = RemoteNames.CLIENT_PRODUCT_DETAILS;
      const remoteModule = `${remoteName}/Routes`;

      mfRegisterRemote(remoteName);

      return loadRemote<typeof import('client_product_details/Routes')>(remoteModule).then(
        (m) => m!.remoteRoutes
      )
    },
  },
];
