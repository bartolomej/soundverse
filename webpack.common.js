const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const SOURCE_ROOT = path.resolve(__dirname, 'src');
const DIST_ROOT = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.resolve(__dirname, './src/app/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: [/\.vert$/, /\.frag$/, /\.glsl$/],
        use: ['raw-loader'],
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/app/index.html'),
      filename: 'index.html',
    }),
    new CopyPlugin([
      {
        from: path.join(SOURCE_ROOT, 'index.html'),
        to: DIST_ROOT
      },
      {
        from: path.join(SOURCE_ROOT, 'assets'),
        to: DIST_ROOT
      },
    ]),
  ],
  output: {
    path: DIST_ROOT,
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  }
};
