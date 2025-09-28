import { ModuleFederationConfig } from '@nx/module-federation';
import { sharedFn } from '@ewandr-workspace/core';

const config: ModuleFederationConfig = {
  name: 'client_product_details',
  exposes: {
    './Routes': 'apps/clients/client_product_details/src/app/remote-entry/entry.routes.ts',
  },
  shared: sharedFn,
  // Production optimizations
  library: {
    type: 'module',
    name: 'client_product_details',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
