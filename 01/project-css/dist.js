var depRelation = [{
      key: "index.js",
      deps: ["style.css"],
      code: function(require, module, exports) {
        "use strict";

require("./style.css");

console.log(12342423);
      } 
    },{
      key: "style.css",
      deps: [],
      code: function(require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var str = "body{\r\n  color: rebeccapurple;\r\n}";

if (document) {
  var style = document.createElement('style');
  style.innerHTML = str;
  document.head.appendChild(style);
}

var _default = str;
exports["default"] = _default;
      } 
    }];
var modules = {};
execute(depRelation[0].key)

  function execute(key) {
    if (modules[key]) { return modules[key] }
    var item = depRelation.find(i => i.key === key)
    if (!item) { throw new Error(`${item} is not found`) }
    var pathToKey = (path) => {
      var dirname = key.substring(0, key.lastIndexOf('/') + 1)
      var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
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
  