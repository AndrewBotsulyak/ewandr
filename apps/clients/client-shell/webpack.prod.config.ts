import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config.prod';
import { Configuration } from 'webpack';

/**
 * Production-optimized webpack configuration with advanced code splitting
 */
const prodConfig: Configuration = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk for large third-party libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          enforce: true,
          minSize: 30000,
          maxSize: 244000, // Split if larger than ~240KB
        },
        // Angular-specific chunk
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          chunks: 'all',
          priority: 20,
          enforce: true,
          minSize: 20000,
          maxSize: 200000,
        },
        // Material UI chunk
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
          name: 'material',
          chunks: 'all',
          priority: 25,
          enforce: true,
          minSize: 20000,
        },
        // RxJS chunk
        rxjs: {
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          name: 'rxjs',
          chunks: 'all',
          priority: 15,
          enforce: true,
        },
        // GraphQL/Apollo chunk
        graphql: {
          test: /[\\/]node_modules[\\/](graphql|@apollo)[\\/]/,
          name: 'graphql',
          chunks: 'all',
          priority: 15,
          enforce: true,
        },
        // Common shared libraries chunk
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          enforce: true,
          minSize: 10000,
        },
      },
    },
    // Enable runtime chunk optimization
    runtimeChunk: {
      name: 'runtime',
    },
    // Enable module concatenation for better tree shaking
    concatenateModules: true,
    // Remove empty chunks
    removeEmptyChunks: true,
    // Merge duplicate chunks
    mergeDuplicateChunks: true,
  },
  // Enable performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 300000, // 300KB
    maxAssetSize: 250000, // 250KB
  },
};

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default async (baseConfig: Configuration) => {
  const mfConfigFn = await withModuleFederation(config, { dts: false });
  const mfConfig = mfConfigFn(baseConfig);
  
  return {
    ...mfConfig,
    ...prodConfig,
    optimization: {
      ...mfConfig.optimization,
      ...prodConfig.optimization,
    },
    performance: {
      ...mfConfig.performance,
      ...prodConfig.performance,
    },
  };
};