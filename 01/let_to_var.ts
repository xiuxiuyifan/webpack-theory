//使用@babel/core 和 @babel/preset-env把代码自动转化成ES5

import { parse } from '@babel/parser'
import * as babel from '@babel/core'
import * as fs from 'fs'

//从文件中读取源代码，并转成字符串
let code = fs.readFileSync('./test.js').toString()

//把字符串转成ast
const ast = parse(code, { sourceType: 'module' })

//把ats变成字符串
const result = babel.transformFromAstSync(ast, code, {
  presets: ['@babel/preset-env']
})

//把生成好的字符串写入文件里面
let fileName = 'test.es5.js'
fs.writeFileSync(fileName, result.code)



