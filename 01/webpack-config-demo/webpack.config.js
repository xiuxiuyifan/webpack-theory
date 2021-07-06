const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = 'production'

const cssLoaders = (...loaders) => [
  // Creates `style` nodes from JS strings
  mode === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
  // Translates CSS into CommonJS
  {
    loader: 'css-loader',
    options: {
      modules: {
        compileType: 'icss',
      },
    },
  },
  ...loaders
]
module.exports = {
  mode,
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']  //不加就不会去检测.jsx文件了
    }),
    mode === 'production' && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react',
                {
                  runtime: 'classic'  //使用经典版
                }
              ],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders({
          loader: "sass-loader",
          options: {
            additionalData: `
              @import '@/var.scss';
              `,
            sassOptions: {
              includePaths: [__dirname]  //基于当前目录
            },
          },
        })
      },
      {
        test: /\.less$/i,
        use: cssLoaders({
          loader: "less-loader",
          options: {
            additionalData: `
                @import './_var.less';
              `
          },
        })
      },
      {
        test: /\.styl$/,
        use: cssLoaders({
          loader: "stylus-loader",
          options: {
            stylusOptions: {
              import: [path.resolve(__dirname, "src/_var.styl")]
            }
          }
        })
      }
    ]
  }
}