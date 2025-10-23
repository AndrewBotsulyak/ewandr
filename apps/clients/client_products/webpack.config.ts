import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 *
 * Note: Custom webpack splitChunks configuration does not effectively reduce chunks
 * with Module Federation because MF manages shared dependencies through its own runtime.
 * To reduce chunks, configure eager loading in mf-shared-libs.ts instead.
 */
export default withModuleFederation(config, { dts: false });
