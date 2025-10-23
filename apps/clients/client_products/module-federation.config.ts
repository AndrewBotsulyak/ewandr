import { ModuleFederationConfig } from '@nx/module-federation';
import {remoteSharedFn} from "@ewandr-workspace/core";

const config: ModuleFederationConfig = {
  name: 'client_products',
  exposes: {
    './Routes': 'apps/clients/client_products/src/app/remote-entry/entry.routes.ts',
  },
  shared: remoteSharedFn,
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
