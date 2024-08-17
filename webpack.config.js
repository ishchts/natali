
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import path from 'path';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: 'node.js',
    path: path.resolve(__dirname, './dist/'),
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
    watchFiles: ['src/**/*'],
    open: true,
    compress: true,
    historyApiFallback: true,
    client: {
      logging: 'info',
      overlay: true,
      progress: true,
      reconnect: true,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  optimization: {
    minimize: true,
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
};
