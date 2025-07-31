import {
  AssetNamingStrategy,
  DefaultAssetNamingStrategy,
  RequestContext,
} from '@vendure/core';
import * as process from "node:process";

const BUCKET_PATH = 'db-assets/' +
      (process.env.NODE_ENV === 'development' ? 'dev' : 'prod');

console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
console.log('BUCKET_PATH = ', BUCKET_PATH);

export class DbAssetsNamingStrategy
  extends DefaultAssetNamingStrategy
  implements AssetNamingStrategy
{
  /** Сохраняем «источник» в префиксе db-assets/… */
  generateSourceFileName(
    ctx: RequestContext,
    originalFileName: string,
    conflictFileName?: string,
  ): string {
    const filename = super.generateSourceFileName(
      ctx,
      originalFileName,
      conflictFileName,
    );
    return `${BUCKET_PATH}/${filename}`;
  }

  /** То же для «превьюшки» */
  generatePreviewFileName(
    ctx: RequestContext,
    sourceFileName: string,
    conflictFileName?: string,
  ): string {
    const filename = super.generatePreviewFileName(
      ctx,
      sourceFileName,
      conflictFileName,
    );
    return `${BUCKET_PATH}/preview/${filename}`;
  }
}
