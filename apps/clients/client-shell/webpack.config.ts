import { composePlugins, withNx } from '@nx/webpack';
import { withModuleFederation } from '@nx/module-federation/angular';
import mfConfig from './module-federation.config';

export default composePlugins(
  withNx(),
  withModuleFederation(mfConfig, { dts: false })
);
