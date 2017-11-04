import webpack from 'webpack';
import path from 'path';

export default {
  entry: {
    common: './src/_calendar'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist',
    libraryTarget: 'umd',
    library: '_calendar'
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules']
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      use: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
