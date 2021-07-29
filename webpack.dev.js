const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {

  entry: {
    main: path.resolve(__dirname, 'src/index.jsx'),
    room: path.resolve(__dirname, 'src/room.jsx'),
  },
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'main.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/room.html',
      filename: 'room.html',
      chunks: ['room'],
    }),
  ],
};
