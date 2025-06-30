import {init} from "@module-federation/enhanced/runtime";

console.log('Bootstrapp');

fetch('https://cdn.ewandr.com/client-shell/mf-manifest.prod.json')
  .then(r => r.json())
  .then((manifest) => {
    console.log('fetch(environment.manifestUrl) = ', manifest);
    return init({
      name: 'client-shell',
      remotes: [
        {
          name: 'client_products',
          entry: manifest['client_products'].browser,
        }
      ]
    });
  })
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
