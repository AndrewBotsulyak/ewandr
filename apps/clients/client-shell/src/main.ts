import {setManifest} from "./manifest-operations";
import {environment} from "./environments/environment";

console.log('Bootstrapp');

function handleManifest(manifest: any) {
  if (!manifest) {
    console.error('Manifest not found in window.__MF_MANIFEST__');
    throw new Error('Manifest not available');
  }

  if (environment.ssr) {
    console.log('Using inlined manifest:', manifest);
  }
  else {
    console.log('Using fetched manifest:', manifest);
  }

// Set the manifest before bootstrapping
  setManifest(manifest);
}

if (environment.ssr === false) {
  fetch(environment.mfManifestURL)
    .then(r => r.json())
    .then((manifest) => {
      handleManifest(manifest);
    })
    .then(() => import('./bootstrap'))
    .catch((err) => console.error(err));
} else {
  // Get the manifest that was inlined by SSR
  const manifest = (window as any).__MF_MANIFEST__;

  handleManifest(manifest);

// Bootstrap the app
  import('./bootstrap').catch((err) => console.error(err));
}

