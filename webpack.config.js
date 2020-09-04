const path = require('path')
const webpack = require('webpack')
const { merge: webpackMerge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  const isDevelopment = env === 'development';

  const baseConfig = {
    entry: './src/js/index.js',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
          ]
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        ENV_IS_DEVELOPMENT: isDevelopment,
        ENV_IS: JSON.stringify(isDevelopment ? 'development' : 'production'),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html',
      }),
    ]
  };

  if (isDevelopment) {
    return webpackMerge(baseConfig, {
      mode: 'development',
      devServer: {
        contentBase: path.resolve(__dirname, './src/js'),
        publicPath: '/',
        watchContentBase: false,
        hotOnly: true,
        overlay: true,
        host: '0.0.0.0',
        port: 3000,
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ]
    });
  } else {
    return webpackMerge(baseConfig, {
      mode: 'production',
      output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js',
        publicPath: '/',
      },
    });
  }
}
