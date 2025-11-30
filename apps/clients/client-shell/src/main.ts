import {setManifest} from "./manifest-operations";

console.log('Bootstrapp');

// Get the manifest that was inlined by SSR
const manifest = (window as any).__MF_MANIFEST__;

if (!manifest) {
  console.error('Manifest not found in window.__MF_MANIFEST__');
  throw new Error('Manifest not available');
}

console.log('Using inlined manifest:', manifest);

// Set the manifest before bootstrapping
setManifest(manifest);

// Bootstrap the app
import('./bootstrap').catch((err) => console.error(err));

