import {SharedFunction, SharedLibraryConfig} from "@nx/module-federation/src/utils/models";
const deps = require('../../../../../package.json').dependencies;

type SharedLibsT = {[key: string]: SharedLibraryConfig};

/**
 * Shared library configuration for REMOTE applications.
 * All dependencies are marked as eager: false because remotes rely on the HOST
 * to provide these dependencies at runtime via the shared scope.
 *
 * This keeps remote bundles small (~100-500KB) while the host bundles
 * all shared dependencies eagerly.
 */
const remoteSharedLibs: SharedLibsT = {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/core'],
    eager: false // Host provides this
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/common'],
    eager: false // Host provides this
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/router'],
    eager: false // Host provides this
  },
  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/platform-browser'],
    eager: false // Host provides this
  },
  'rxjs': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['rxjs'],
    eager: false // Host provides this
  },
  '@angular/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/animations'],
    eager: false // Host provides this
  },
  '@angular/common/http': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/common'],
    eager: false // Host provides this
  },
  '@angular/forms': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/forms'],
    eager: false // Host provides this
  },
  '@ngrx/store': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@ngrx/store'],
    eager: false // Host provides this
  },
  '@ngrx/effects': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@ngrx/effects'],
    eager: false // Host provides this
  },
  'apollo-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['apollo-angular'],
    eager: false // Host provides this
  },
  '@apollo/client': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@apollo/client'],
    eager: false // Host provides this
  },
  'graphql': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['graphql'],
    eager: false // Host provides this
  },
  '@angular/cdk': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/cdk'],
    eager: false // Host provides this
  },
  '@angular/material': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/material'],
    eager: false // Host provides this
  },
};

export const remoteSharedKeys = Object.keys(remoteSharedLibs);

export const remoteSharedFn: SharedFunction = (libraryName: string, defaultConfig: SharedLibraryConfig) => {
  if (libraryName != null) {
    // Special handling: @apollo/client sub-modules should not be shared
    if (libraryName.startsWith('@apollo/client/')) {
      return false;
    }

    // Find parent package config (e.g., @angular/animations for @angular/animations/browser)
    const libName = remoteSharedKeys.find(key => libraryName === key || libraryName.startsWith(key + '/'));

    if (libName != null) {
      // Return parent package config with eager: false
      return remoteSharedLibs[libName];
    }

    return defaultConfig;
  }
  return defaultConfig;
};
