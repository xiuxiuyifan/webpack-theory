module.exports = {
  //继承 eslint-config-react-app（是检测js代码的）这个里面包含create react app的eslint配置
  "extends": "react-app",
  rules: {
    // jsx使用 react
    'react/jsx-uses-react': [2],
    // 提示要在 JSX 文件里手动引入 React
    'react/react-in-jsx-scope': [2],
    'no-console': [0]
  },
  //覆盖之前的配置（检测ts代码）
  overrides: [{
    files: ['*.ts', '*.tsx'],
    parserOptions: {
      project: './tsconfig.json',
    },
    extends: ['airbnb-typescript'],
    rules: {
      '@typescript-eslint/object-curly-spacing': [0],
      'import/prefer-default-export': [0],
      'no-console': [0],
      'import/extensions': [0]
    }
  }]
}