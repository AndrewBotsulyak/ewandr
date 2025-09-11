const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const preset = require("../../../libs/client-core/src/lib/styles/tailwind.preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: { preflight: false },
};
