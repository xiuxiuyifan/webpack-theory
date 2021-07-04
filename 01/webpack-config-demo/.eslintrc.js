module.exports = {
  //继承 eslint-config-react-app这个里面包含create react app的eslint配置
  "extends": "react-app",
  rules: {
    // jsx使用 react
    'react/jsx-uses-react': [2],
    // 提示要在 JSX 文件里手动引入 React
    'react/react-in-jsx-scope': [2],
    'no-console': [0]
  },
}