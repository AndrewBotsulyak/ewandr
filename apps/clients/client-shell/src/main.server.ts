import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import * as express from 'express';
import * as cors from 'cors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './bootstrap.server';
import { environment } from './environments/environment';
import * as fs from "node:fs";
import {loadDevMessages, loadErrorMessages} from "@apollo/client/dev";
import { registerRemotes } from "@module-federation/enhanced/runtime";

if (!environment.production) {
  loadDevMessages();
  loadErrorMessages();
}

// Store manifest globally for SSR injection
let globalManifest: any = null;

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

  // Serve remote apps from dist folder only in local-production mode
  if (environment.isLocalProd === true) {
    const clientProductsBrowserDistFolder = join(process.cwd(), 'dist/apps/clients/client_products/browser');
    const clientProductsServerDistFolder = join(process.cwd(), 'dist/apps/clients/client_products/server');
    const clientProductDetailsBrowserDistFolder = join(process.cwd(), 'dist/apps/clients/client_product_details/browser');
    const clientProductDetailsServerDistFolder = join(process.cwd(), 'dist/apps/clients/client_product_details/server');

    // Serve browser build for client_products
    server.use(
      '/client_products',
      express.static(clientProductsBrowserDistFolder, {
        maxAge: '1y',
      })
    );

    // Serve server build for client_products (for SSR remoteEntry)
    server.use(
      '/client_products/server',
      express.static(clientProductsServerDistFolder, {
        maxAge: '1y',
      })
    );

    // Serve browser build for client_product_details
    server.use(
      '/client_product_details',
      express.static(clientProductDetailsBrowserDistFolder, {
        maxAge: '1y',
      })
    );

    // Serve server build for client_product_details (for SSR remoteEntry)
    server.use(
      '/client_product_details/server',
      express.static(clientProductDetailsServerDistFolder, {
        maxAge: '1y',
      })
    );
  }

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
        bootstrap: (context) => bootstrap(context, {
          providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
        }),
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
      })
      .then((html) => {
        // Inject the manifest into the HTML before </head>
        if (globalManifest) {
          const manifestScript = `<script>window.__MF_MANIFEST__ = ${JSON.stringify(globalManifest)};</script>`;
          html = html.replace('</head>', `${manifestScript}</head>`);
        }
        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

async function run(): Promise<void> {
  const port = process.env['PORT'] || 4200;

  // Load manifest BEFORE starting the server
  await initModuleFederation();

  // Start up the Node server
  const server = await app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
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
    const response = await fetch(manifestPath);
    mfManifest = await response.json();
  }

  // Store manifest globally for SSR injection
  globalManifest = mfManifest;

  const remotes: any[] = [];

  console.log('mfManifest = ', mfManifest);

  Object.keys(mfManifest).forEach((remoteName) => {
    remotes.push({
      name: remoteName,
      entry: mfManifest[remoteName].server,
      type: 'commonjs-module'
    });
  });

  // Only register if the runtime is initialized (may not be with empty remotes config)
  try {
    registerRemotes(remotes);
    console.log('SSR: Successfully registered remotes');
  } catch (error: any) {
    console.log('SSR: Skipping registerRemotes, will load dynamically:', error?.message || error);
  }
}

run();

export default bootstrap;
