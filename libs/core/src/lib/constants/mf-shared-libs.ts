import {SharedFunction, SharedLibraryConfig} from "@nx/module-federation/src/utils/models";
const deps = require('../../../../../package.json').dependencies;

export const mfSharedLibs: {[key: string]: SharedLibraryConfig} = {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/core'],
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/common'],
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/router'],
  },
  '@angular/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/animations'],
  },
  '@angular/cdk': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/cdk'],
  },
  '@angular/material': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/material'],
  },
  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@angular/platform-browser'],
  },
  'rxjs': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['rxjs'],
  },
  '@apollo/client': {
    singleton: true,
    strictVersion: true,
    requiredVersion: deps['@apollo/client'],
  },
};

export const sharedKeys = Object.keys(mfSharedLibs);

export const sharedFn: SharedFunction = (libraryName: string, defaultConfig: SharedLibraryConfig) => {
  if (libraryName != null) {
    const libName = sharedKeys.find(key => libraryName === key || libraryName.startsWith(key + '/'));

    if (libraryName.startsWith('@apollo/client/')) {
      return false;
    }

    return libName != null ? mfSharedLibs[libName] : defaultConfig;
  }
  return defaultConfig;
};
