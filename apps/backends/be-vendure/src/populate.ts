import { bootstrap, DefaultJobQueuePlugin } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { config } from './vendure-config';
import {AdminUiPlugin} from "@vendure/admin-ui-plugin";
import {initialData} from "../initial-data";

const populateConfig = {
  ...config,
  plugins: (config.plugins || []).filter(
    // Отключаем AdminUiPlugin при populate
    plugin => plugin !== AdminUiPlugin
  ),
};

populate(
  () => bootstrap(populateConfig),
  initialData,
  'assets/products.csv'
)
  .then(app => {
    return app.close();
  })
  .then(
    () => process.exit(0),
    err => {
      console.log(err);
      process.exit(1);
    }
  );
