var debug = true;
var webpack = require("webpack");
var path = require("path");

module.exports = {
  mode: "development",
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./examples/basic_example/src/basic_example.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "ts-loader",
      },
      {
        test: /\.css?$/,
        loaders: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: __dirname + "/examples",
    filename: "client.min.tsx",
  },
  plugins: debug
    ? []
    : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          mangle: false,
          sourcemap: false,
        }),
      ],
};
