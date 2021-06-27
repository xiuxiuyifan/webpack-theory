import * as babel from '@babel/core';
//分析index.js里面代码依赖的文件
import { resolve, relative, dirname } from 'path'
import { readFileSync } from 'fs'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse';


//设置项目根目录


const projectRoot = resolve(__dirname, 'project-03')

//声明最终结果的类型
var result = {
  'index.js': {
    deps: ['a.js', 'b.js'],
    code: "import a from './a'\r\nimport b from './b'\r\n\r\nvar sum = a.value + b.value \r\n\r\nconsole.log(sum)"
  }
}

type DepRelation = {
  [key: string]: {
    deps: string[],
    code: string
  }
}

interface a {

}
//初始化

const depRelation: DepRelation = {}

function collectCodeAndDeps(filepath: string) {
  let key = getProjectPath(filepath)
  if (Object.keys(depRelation).includes(key)) {
    // 注意，重复依赖不一定是循环依赖
    return
  }
  //先读取index文件的内容
  //把字符串代码转换成ats
  let code = readFileSync(resolve(filepath)).toString()

  //把读取到的es6代码先进行转换成es5的
  const {code: es5Code} = babel.transform(code, {
    presets: ['@babel/preset-env']
  })

  //把入口文件的文件名当做map的key
  depRelation[key] = {
    deps: [],
    code: es5Code
  }

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
        depRelation[key].deps.push(depProjectPath)
        //拿到依赖文件的真实路径进行再一次依赖分析
        collectCodeAndDeps(depAbsolutePath)
      }
    }
  })
}

collectCodeAndDeps(resolve(projectRoot, 'index.js'))

console.log(depRelation)

//获取文件相对跟目录的相对路径
/*
C: \\Users\\code\\zf\\webpack\\01\\project - 01
C: \\Users\\code\\zf\\webpack\\01\\project - 01\\index.js

//得到的结果就是index.js
*/
function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}