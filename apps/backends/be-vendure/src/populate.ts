import { bootstrap } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { config } from './vendure-config';
import { initialData } from '../initial-data';
import path from 'path';
import fs from 'fs';

// Get the path to the local assets directory
const assetsDir = path.join(__dirname, '../assets');
const productsCsvPath = path.join(assetsDir, 'products.csv');
const imagesDir = path.join(assetsDir, 'images');

// Ensure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

populate(
  () => bootstrap({
    ...config,
    apiOptions: {
      ...config.apiOptions,
      port: 3001, // Use a different port for population
    },
    importExportOptions: {
      importAssetsDir: imagesDir,
    },
    dbConnectionOptions: {...config.dbConnectionOptions, synchronize: true}
  }),
  initialData,
  productsCsvPath
)
  .then(app => {
    console.log('Population completed successfully');
    app.close();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
