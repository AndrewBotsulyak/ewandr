// apps/backends/be-core-service/webpack.config.js
const { join } = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

module.exports = (config, context) => {

  const baseConfig = {
    output: {
      path: join(__dirname, '../../../dist/apps/backends/be-core-service'),
    },
    plugins: [
      new NxAppWebpackPlugin({
        target: 'node',
        compiler: 'tsc',
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        assets: ['./src/assets'],
        optimization: false,
        outputHashing: 'none',
        generatePackageJson: true,
        poll: 500
      }),
    ],
  };

  return baseConfig;
};
