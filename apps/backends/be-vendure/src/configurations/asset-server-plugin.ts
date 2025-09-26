import {AssetServerPlugin, configureS3AssetStorage} from "@vendure/asset-server-plugin";
import path from "path";
import {DbAssetsNamingStrategy} from "../plugins/db-assets-naming-strategy";
import { BUCKET_NAME } from "./constants";

export const assetServerPlugin = () => {
  return AssetServerPlugin.init({
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
  })
};
