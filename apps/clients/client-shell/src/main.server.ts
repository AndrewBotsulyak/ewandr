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


// The Express app is exported so that it can be used by serverless Functions.
export async function app(): Promise<express.Express> {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/apps/clients/client-shell/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

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

    console.log('environment = ', environment);

    const manifestPath = join(process.cwd(), 'dist/apps/clients/client_products/server/mf-manifest.json');

    console.log('manifestPath = ', manifestPath);
    console.log('fs.existsSync(manifestPath) = ', fs.existsSync(manifestPath));

    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest не найден по пути: ${manifestPath}`);
    }

    const response = await fetch('https://cdn.ewandr.com/client-shell/mf-manifest.prod.json')
    const mfManifest = await response.json();

    const resultManifest = {
      name: 'client-shell',
      remotes: [
        {
          name: 'client_products',
          // @ts-ignore
          entry: mfManifest['client_products'].server,
        }
      ]
    };

    console.log('resultManifest = ', resultManifest);

    init(resultManifest);
  });
}

run();

export default bootstrap;
