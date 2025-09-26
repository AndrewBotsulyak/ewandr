import {ApiOptions} from "@vendure/core/dist/config/vendure-config";

export const apiOptions: ApiOptions = {
  port: 3000,
  adminApiPath: 'admin-api',
  shopApiPath: 'api',
  cors: {
    origin: true,
    credentials: true,
  },
};
