const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: "production",
  plugins: [new ESLintPlugin({
    extensions: ['.js', '.jsx']  //不加就不会去检测.jsx文件了
  })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
              ]
            ]
          }
        }
      }
    ]
  }
}