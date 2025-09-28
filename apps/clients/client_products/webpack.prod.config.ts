import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config.prod';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

interface WebpackConfigOptions {
  options?: {
    configuration?: string;
    [key: string]: unknown;
  };
  context?: {
    [key: string]: unknown;
  };
}

/**
 * Production-optimized webpack configuration for client_products microfrontend
 */
const prodConfig: Configuration = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk for third-party libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          enforce: true,
          minSize: 20000,
          maxSize: 200000, // Smaller chunks for microfrontends
        },
        // Component-specific chunk
        components: {
          test: /[\\/]src[\\/]app[\\/].*\.component\.[jt]s$/,
          name: 'components',
          chunks: 'all',
          priority: 8,
          minChunks: 2,
          minSize: 10000,
        },
        // Services chunk
        services: {
          test: /[\\/]src[\\/]app[\\/].*\.service\.[jt]s$/,
          name: 'services',
          chunks: 'all',
          priority: 8,
          minChunks: 2,
          minSize: 5000,
        },
        // Common chunk for frequently used modules
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          minSize: 5000,
        },
      },
    },
    // Smaller runtime chunk for microfrontends
    runtimeChunk: {
      name: 'runtime',
    },
    concatenateModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 200000, // 200KB for microfrontends
    maxAssetSize: 150000, // 150KB
  },
};

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default async function (webpackConfigOptions: WebpackConfigOptions) {
  const federatedModules = await withModuleFederation(config, { dts: false });
  const baseConfig = federatedModules(webpackConfigOptions);
  return merge(baseConfig, prodConfig);
}