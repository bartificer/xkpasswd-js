// Needed hackery to get __filename and __dirname in ES6 mode
// see: https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hack to import Webpack plugins in ES6 mode
// Hint comes from error message of Webpack itself
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export default {
  mode: 'development',
  entry: './src/index.mjs',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      hash: false,
      template: './src/index.html',
      filename: 'index.html',
      inject: true,
      collapseWhitespace: true,
      removeComments: true,
    }),
    new CopyPlugin({
      patterns: [
        // copy all images as is to dist,
        // this notation is used to avoid copying the entire path
        {
          from: 'src/assets/*.(png|ico|webmanifest)',
          to: 'assets/[name][ext]',
        },
      ],
    }),
    // add jQuery as a global setting,
    // so we don't have to import it everywhere
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].[chunkhash].js',
    assetModuleFilename: 'media/[name][hash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

};
