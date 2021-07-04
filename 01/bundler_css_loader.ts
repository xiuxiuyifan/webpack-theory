import * as babel from '@babel/core';
//分析index.js里面代码依赖的文件
import { resolve, relative, dirname } from 'path'
import { readFileSync, writeFileSync } from 'fs'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse';


//设置项目根目录
const projectRoot = resolve(__dirname, 'project-css')

//声明最终结果的类型
// var depRelation = [
//   {
//     key: 'index.js',
//     deps: ['a.js', 'b.js'],
//     code: "import a from './a'\r\nimport b from './b'\r\n\r\nvar sum = a.value + b.value \r\n\r\nconsole.log(sum)"
//   },
//   {
//     key: 'a.js',
//     deps: [],
//     code: ""
//   }
// ]
// execute(depRelation[0].key)

// function exection(key) {
//   var item = depRelation.find(i => key === i.key)
//   item.code()  ?   执行入口文件代码
// }



type DepRelation = { key: string, deps: string[], code: string }[]


//初始化

const depRelation: DepRelation = []

function collectCodeAndDeps(filepath: string) {
  let key = getProjectPath(filepath)
  if (depRelation.find(item => key === item.key)) {
    // 注意，重复依赖不一定是循环依赖
    return
  }
  //先读取index文件的内容
  //把字符串代码转换成ats
  let code = readFileSync(resolve(filepath)).toString()
  //判断是.css结尾的文件
  if(/\.css$/.test(filepath)){
    code = require('./loaders/css-loader.js')(code)
    code = require('./loaders/style-loader.js')(code)
  }
  //把读取到的es6代码先进行转换成es5的
  const { code: es5Code } = babel.transform(code, {
    presets: ['@babel/preset-env']
  })

  //把入口文件的文件名当做map的key
  let item = {
    key,
    deps: [],
    code: es5Code
  }
  depRelation.push(item)

  let ast = parse(code, {
    sourceType: 'module'
  })

  //遍历ast

  traverse(ast, {
    enter: path => {
      //如果发现当前语句是 import 就把inport的value 写入到依赖中去
      if (path.node.type === 'ImportDeclaration') {
        //当前文件的上一级目录 与获取到当前文件的依赖文件进行拼接。
        let depAbsolutePath = resolve(dirname(filepath), path.node.source.value)
        //获取当前文件与根目录的相对路径
        const depProjectPath = getProjectPath(depAbsolutePath)
        // 把依赖写进 depRelation
        item.deps.push(depProjectPath)
        //拿到依赖文件的真实路径进行再一次依赖分析
        collectCodeAndDeps(depAbsolutePath)
      }
    }
  })
}

collectCodeAndDeps(resolve(projectRoot, 'index.js'))

writeFileSync('./project-css/dist.js', generateCode())

function generateCode() {
  let code = ''
  //根据当前的依赖关系构建dist文件的一部分，把code变成fucntion
  code += 'var depRelation = [' + depRelation.map(item => {
    let { key, deps, code } = item
    return `{
      key: ${JSON.stringify(key)},
      deps: ${JSON.stringify(deps)},
      code: function(require, module, exports) {
        ${code}
      } 
    }`
  }).join(',') + '];\n'

  code += 'var modules = {};\n'
  code += `execute(depRelation[0].key)\n`
  code += `
  function execute(key) {
    if (modules[key]) { return modules[key] }
    var item = depRelation.find(i => i.key === key)
    if (!item) { throw new Error(\`\${item} is not found\`) }
    var pathToKey = (path) => {
      var dirname = key.substring(0, key.lastIndexOf('/') + 1)
      var projectPath = (dirname + path).replace(\/\\.\\\/\/g, '').replace(\/\\\/\\\/\/, '/')
      return projectPath
    }
    var require = (path) => {
      return execute(pathToKey(path))
    }
    modules[key] = { __esModule: true }
    var module = { exports: modules[key] }
    item.code(require, module, module.exports)
    return modules[key]
  }
  `
  return code
}
//获取文件相对跟目录的相对路径
/*
C: \\Users\\code\\zf\\webpack\\01\\project - 01
C: \\Users\\code\\zf\\webpack\\01\\project - 01\\index.js

//得到的结果就是index.js
*/
function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}