// Needed hackery to get __filename and __dirname in ES6 mode
// see: https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATH = {
  src: './src',
  src_assets: './src/assets',
  dist: './dist',
  dist_assets: './dist/assets',
};

export default {
  mode: 'development',
  entry: `${PATH.src}/index.mjs`,
  devtool: 'inline-source-map',
  devServer: {
    static: `${PATH.dist}`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      hash: false,
      template: `${PATH.src}/index.html`,
      filename: 'index.html',
      inject: true,
      collapseWhitespace: true,
      removeComments: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets/*.(png|ico|webmanifest)',
          to: 'assets/[name][ext]',
        },
      ],
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
