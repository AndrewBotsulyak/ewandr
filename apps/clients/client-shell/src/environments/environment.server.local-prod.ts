/*
the purpose of this env file is to run server locally with production configurations and use local remote builds
This is just for local development
 */

export const environment = {
  production: false,
  ssr: true,
  mfManifestURL: 'apps/clients/client-shell/public/mf-manifest.local-prod.json',
  apiUrl: 'http://localhost:80/api',
  isLocalProd: true
};
