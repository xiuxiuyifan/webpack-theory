const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')

module.exports = {
  mode: "production",
  plugins: [new ESLintPlugin({
    extensions: ['.js', '.jsx', '.ts', '.tsx']  //不加就不会去检测.jsx文件了
  })],
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
      }
    ]
  }
}