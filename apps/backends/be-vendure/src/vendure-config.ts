import {DefaultAssetNamingStrategy, VendureConfig } from '@vendure/core';
import {AssetServerPlugin, configureS3AssetStorage} from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { DefaultJobQueuePlugin, DefaultSchedulerPlugin } from '@vendure/core';
import { DefaultSearchPlugin } from '@vendure/core';

import path from 'path';
import {DbAssetsNamingStrategy} from "./plugins/db-assets-naming-strategy";
import {GraphiqlPlugin} from "@vendure/graphiql-plugin";
import {LanguageCode} from "@vendure/common/lib/generated-types";

const BUCKET_NAME = 'cdn.ewandr.com';

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'api',
    cors: {
      origin: true,
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: 'superadmin',
      password: 'superadmin',
    },
  },
  dbConnectionOptions: {
    type: 'postgres',
    synchronize: true,
    logging: true,
    database: process.env.DB_NAME || 'vendure',
    host: process.env.DB_HOST || (process.env.NODE_ENV === 'development' ? 'localhost' : 'postgres-vendure-db'),  // Для локального воркера используем localhost
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
    migrations: [path.join(__dirname, '../migrations/*.+(js|ts)')],
  },
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  customFields: {
    ProductOption: [
      {
        name: 'description',
        type: 'string',
        label: [{ languageCode: LanguageCode.en, value: 'Description' }],
        ui: { component: 'textarea-form-input' },
      },
      {
        name: 'isColor',
        type: 'boolean',
        label: [{ languageCode: LanguageCode.en, value: 'Is color option?' }],
        defaultValue: false,
      },
    ],
    Product: [
      {
        name: 'shortDesc',
        type: 'text',
        label: [{ languageCode: LanguageCode.en, value: 'Short Description' }],
        ui: { component: 'textarea-form-input' },
      }
    ]
  },
  plugins: [
    GraphiqlPlugin.init({
      route: 'graphiql',   // будет доступно по /graphiql/shop и /graphiql/admin
    }),
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'), // Local fallback for processing
      namingStrategy: new DbAssetsNamingStrategy(),
      assetUrlPrefix: 'https://cdn.ewandr.com/',
      storageStrategyFactory: configureS3AssetStorage({
        bucket: BUCKET_NAME,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        nativeS3Configuration: {
          region: process.env.AWS_REGION,
        },
      }),
    }),
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
