import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyWebpackPlugin({
          patterns: [
            { from: 'src/assets/images', to: 'assets/images' }, // Copies all images from src/assets/images to dist/images
            // You can add more patterns for other static assets if needed
            // { from: 'src/static', to: 'static' },
          ],
        }),
];
