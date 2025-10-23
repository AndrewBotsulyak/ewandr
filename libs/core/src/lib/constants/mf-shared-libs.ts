import {SharedFunction, SharedLibraryConfig} from "@nx/module-federation/src/utils/models";
const deps = require('../../../../../package.json').dependencies;

type SharedLibsT = {[key: string]: SharedLibraryConfig};

const criticalForBootstrapping: SharedLibsT = {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/core'],
    eager: true
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/common'],
    eager: true
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/router'],
    eager: true
  },
  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/platform-browser'],
    eager: true
  },
  'rxjs': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['rxjs'],
    eager: true
  },
  '@angular/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/animations'],
    eager: true
  },
  '@angular/common/http': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/common'],
    eager: true // Used immediately
  },
  '@angular/forms': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/forms'],
    eager: true // Used in header
  },
};

export const mfSharedLibs: SharedLibsT = {
  ...criticalForBootstrapping,

  // Strategy: Make most things eager to bundle them in main.js
  // Only keep truly optional/heavy libraries as lazy
  '@ngrx/store': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@ngrx/store'],
    eager: true // State management is critical
  },
  '@ngrx/effects': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@ngrx/effects'],
    eager: true
  },
  'apollo-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['apollo-angular'],
    eager: true // Data fetching is critical
  },
  '@apollo/client': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@apollo/client'],
    eager: true
  },
  'graphql': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['graphql'],
    eager: true
  },
  '@angular/cdk': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/cdk'],
    eager: true // Used frequently enough to be eager
  },
  '@angular/material': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/material'],
    eager: true // Used in shell and remotes
  },
};

export const sharedKeys = Object.keys(mfSharedLibs);

export const sharedFn: SharedFunction = (libraryName: string, defaultConfig: SharedLibraryConfig) => {
  if (libraryName != null) {
    // Special handling: @apollo/client sub-modules should not be shared
    if (libraryName.startsWith('@apollo/client/')) {
      return false;
    }

    // Find parent package config (e.g., @angular/animations for @angular/animations/browser)
    // This ensures sub-packages inherit the parent's config (including eager setting)
    const libName = sharedKeys.find(key => libraryName === key || libraryName.startsWith(key + '/'));

    if (libName != null) {
      // Return parent package config - applies to all sub-packages
      return mfSharedLibs[libName];
    }

    return defaultConfig;
  }
  return defaultConfig;
};
