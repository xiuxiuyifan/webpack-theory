let a = 'str'
let b = 2
const c = 100
const { dirname } = require('path')
const path = require('path')

// var p = path.resolve(__dirname, 'project-02')

// var p1 = path.resolve(p, './lib/a1.js')


var str = 'C:\\Users\\code\\zf\\webpack\\01\\project-02\\index.js'

var all = dirname(str)

console.log(all)
