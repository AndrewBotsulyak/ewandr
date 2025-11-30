import { ModuleFederationConfig } from '@nx/module-federation';
import {sharedFn} from "@ewandr-workspace/core";

const config: ModuleFederationConfig = {
  name: 'client-shell',
  /**
   * Remotes must be listed here for the dev server to work correctly.
   * In production, they are loaded dynamically via main.ts using the manifest.
   * The dev server needs to know about them at build time to start dev servers.
   */
  remotes: ['client_products', 'client_product_details'],
  shared: sharedFn,
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
