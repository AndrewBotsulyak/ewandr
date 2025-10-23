import { ModuleFederationConfig } from '@nx/module-federation';
import { sharedFn } from '../../../libs/core/src';

const config: ModuleFederationConfig = {
  name: 'client-shell',
  /**
   * Remotes are loaded dynamically at runtime via main.ts
   * to enable truly asynchronous loading on-demand.
   *
   * Static remotes would be bundled at build time, defeating the purpose
   * of lazy loading. The runtime configuration in main.ts fetches the
   * manifest and registers remotes with Module Federation Enhanced.
   */
  remotes: [],
  shared: sharedFn,
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
