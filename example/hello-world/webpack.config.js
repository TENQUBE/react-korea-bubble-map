const HTMLWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: ["./index.js"],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  plugins: [
    new HTMLWebPackPlugin({
      template: "./index.html",
      filename: "./index.html",
    }),
  ],
  devServer: {
    host: "localhost",
    port: "8080",
    historyApiFallback: true,
  },
};
