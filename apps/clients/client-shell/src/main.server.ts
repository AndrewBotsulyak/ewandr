import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import * as express from 'express';
import * as cors from 'cors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './bootstrap.server';
import { environment } from './environments/environment';
import { init } from '@module-federation/enhanced/runtime';
import * as fs from "node:fs";
import {createProxyMiddleware} from "http-proxy-middleware";


// The Express app is exported so that it can be used by serverless Functions.
export async function app(): Promise<express.Express> {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/apps/clients/client-shell/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  // local development
  if (environment.production === false) {
    console.log('createProxyMiddleware');

    server.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:80/api',
        changeOrigin: true,
      })
    );
  }

  server.use(cors());

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

async function run(): Promise<void> {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  const server = await app();
  server.listen(port, async () => {
    console.log(`Node Express server listening on http://localhost:${port}`);

    await initModuleFederation();
  });
}

async function initModuleFederation() {
  const manifestPath = environment.mfManifestURL;

  let mfManifest;

  console.log('environment = ', environment);

  if (environment.production === false) {
    if (!fs.existsSync(join(process.cwd(), manifestPath))) {
      throw new Error(`Manifest doesn't exist on path: ${manifestPath}`);
    }

    const data = fs.readFileSync(manifestPath, 'utf8');
    mfManifest = JSON.parse(data);

    // mfManifest = require(join(process.cwd(), manifestPath));

    console.log('mfManifest = ', mfManifest);
  } else {
    const response = await fetch(manifestPath)
    mfManifest = await response.json();
  }

  const remotes: any[] = [];

  Object.keys(mfManifest).forEach((remoteName) => {
    remotes.push({
      name: remoteName,
      entry: mfManifest[remoteName].server,
    });
  });

  init({
    name: 'client-shell',
    remotes,
  });
}

run();

export default bootstrap;
