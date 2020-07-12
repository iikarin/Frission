const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: [path.join(path.resolve(__dirname, 'src/frontend/'), 'mounter.tsx')],
  output: {
    filename: 'app.bundle.js',
    chunkFilename: 'chunk-[name].bundle.js',
    path: path.join(__dirname, 'frontend-dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(path.resolve(__dirname, 'src/frontend/'), 'index.html'),
      meta: {
        "og:title": "Frision - Don't miss out on your precious school days",
        "twitter:title": "Frision - Don't miss out on your precious school days",
        "og:description": "Frision is an all-in-one app for students to keep track of school work, and socialise!",
        "description": "Frision is an all-in-one app for students to keep track of school work, and socialise!",
        "twitter:description": "Frision is an all-in-one app for students to keep track of school work, and socialise!",
        "og:type": "website",
        "theme": "#202020"
      }
    }),
    new WebpackPwaManifest({
      name: "Skool",
      short_name: "Skool",
      "theme-color": "#EB5757",
      display: "standalone",
      background_color: "#151515",
      description: "Task management app",
    })
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader",
          options: {
            lessOptions: {
              modifyVars: {
                "primary-color": "#3a86ff",
                "secondary-color": "#ff006e"
              },
              javascriptEnabled: true
            }
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'resources/fonts/'
          }
        }]
      },
      {
        test: /\.(png|jpeg|jpg|svg|webp)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'resources/images/'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devServer: {
    historyApiFallback: true,
  },
  mode: process.env.APP_MODE
};
