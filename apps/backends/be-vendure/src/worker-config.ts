import { VendureConfig } from '@vendure/core';
import { DefaultJobQueuePlugin, DefaultSchedulerPlugin } from '@vendure/core';
import { DefaultSearchPlugin } from '@vendure/core';

import path from 'path';
import {LanguageCode} from "@vendure/common/lib/generated-types";

export const workerConfig: VendureConfig = {
  apiOptions: {
    port: 3001, // Worker использует другой порт
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
    host: process.env.DB_HOST || 'postgres-vendure-db',  // В Docker используем имя сервиса
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
    // Минимальная конфигурация для воркера - только необходимые плагины
    DefaultJobQueuePlugin.init({ 
      useDatabaseForBuffer: true,
      pollInterval: 200,
      concurrency: 1
    }),
    DefaultSchedulerPlugin.init(),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
  ],
};
