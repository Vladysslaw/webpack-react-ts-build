const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EsLintWebpackPlugin = require('eslint-webpack-plugin');
const path = require('path');

module.exports = (env = {}) => {
  const { mode = 'development' } = env;

  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({ template: './index.html' }),
      new CleanWebpackPlugin(),
      new EsLintWebpackPlugin({ extensions: ['ts', 'js', 'tsx'] }),
    ];
    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: 'main-[hash:8].css',
      }));
    }
    return plugins;
  };
  return {
    mode: isProd ? 'production' : isDev && 'development',

    entry: './src/index.tsx',

    output: {
      filename: '[name].[hash:8].js',
      path: path.resolve(__dirname, 'dist/'),
    },

    devtool: 'inline-source-map',

    devServer: {
      open: true,
      liveReload: true,
      watchContentBase: true,
      contentBase: 'dist',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(jpg|jpeg|svg|png)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
                name: '[name]-[sha1:hash:7].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(css|scss)$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: getPlugins(),
  };
};
