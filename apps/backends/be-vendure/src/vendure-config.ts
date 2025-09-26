import {VendureConfig } from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { DefaultJobQueuePlugin, DefaultSchedulerPlugin } from '@vendure/core';
import { DefaultSearchPlugin } from '@vendure/core';
import {GraphiqlPlugin} from "@vendure/graphiql-plugin";
import {apiOptions, assetServerPlugin, authOptions, customFields, dbConnectionOptions} from './configurations';

const BUCKET_NAME = 'cdn.ewandr.com';

export const config: VendureConfig = {
  apiOptions,
  // AUTH
  authOptions,
  // Database options
  dbConnectionOptions,
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  customFields,
  plugins: [
    GraphiqlPlugin.init({
      route: 'graphiql',   // будет доступно по /graphiql/shop и /graphiql/admin
    }),
    assetServerPlugin(),
    DefaultJobQueuePlugin.init({
      useDatabaseForBuffer: true,
      pollInterval: 200,
      concurrency: 1
    }),
    DefaultSchedulerPlugin.init(),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
    }),
  ],
};
