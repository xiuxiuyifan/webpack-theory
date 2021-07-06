const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

const pagesDir = './src/pages/'

const mode = 'production'
let entry = {}
let outputHtml = []

var pages = fs.readdirSync(path.resolve(__dirname, pagesDir))
pages.forEach((item)=>{
  let name = item.replace('.js', '')
  entry[name] = `${pagesDir}${item}`
  outputHtml.push(new HtmlWebpackPlugin({
    filename: `${name}.html`,
    chunks: [name]
  }))
})
console.log(entry)
console.log(outputHtml)


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
  entry: entry,
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']  //不加就不会去检测.jsx文件了
    }),
    mode === 'production' && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    ...outputHtml
  ].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',  //运行时文件单独打包
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 10,
          minSize: 0, /* 如果不写 0，由于 React 文件尺寸太小，会直接跳过 */
          test: /[\\/]node_modules[\\/]/, // 为了匹配 /node_modules/ 或 \node_modules\
          name: 'vendors', // 文件名
          chunks: 'all',  // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
          // 这三行的整体意思就是把两种加载方式的来自 node_modules 目录的文件打包为 vendors.xxx.js
          // 其中 vendors 是第三方的意思
        },
        common: {
          priority: 5,
          minSize: 0,
          minChunks: 2,
          chunks: 'all',
          name: 'common'
        }
      },
    },
  },
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