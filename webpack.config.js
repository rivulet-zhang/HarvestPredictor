module.exports = {

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: __dirname,
    publicPath: '/'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }

};
