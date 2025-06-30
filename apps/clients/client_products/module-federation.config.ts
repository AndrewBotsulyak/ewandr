import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'client_products',
  exposes: {
    './Routes': 'apps/clients/client_products/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === '@angular/core' ||
      libraryName === '@angular/common' ||
      libraryName === '@angular/router' ||
      libraryName === '@angular/cdk' ||
      libraryName === '@angular/material' ||
      libraryName === '@angular/animations' ||
      libraryName === '@ewandr-workspace/client-core'
    ) {
      return {
        singleton: true,
        strictVersion: false,
        // eager: true
      };
    }
    return defaultConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
