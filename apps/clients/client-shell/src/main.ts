import {createInstance} from "@module-federation/enhanced/runtime";
import {environment} from "./environments/environment";
import {Remote} from "@module-federation/runtime-core/dist/src/type/config";

console.log('Bootstrapp');

fetch(environment.mfManifestURL)
  .then(r => r.json())
  .then((manifest) => {
    console.log('fetch(environment.manifestUrl) = ', manifest);
    const remotes: Remote[] = [];

    Object.keys(manifest).forEach((remoteName) => {
      remotes.push({
        name: remoteName,
        entry: manifest[remoteName].browser,
      });
    });

    // Create the Module Federation instance with remotes
    createInstance({
      name: 'client-shell',
      remotes,
    });
  })
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
