var depRelation = [{
  key: "index.js",
  deps: ["a.js", "b.js", "c.js"],
  code: function (require, module, exports) {
    "use strict";

    var _a = _interopRequireDefault(require("./a.js"));

    var _b = _interopRequireDefault(require("./b.js"));

    var _c = require("./c.js");

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    console.log(_a["default"].getA());
    console.log(_b["default"].getB());
    console.log(_c.c.value);
  }
}, {
  key: "a.js",
  deps: ["b.js"],
  code: function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;

    var _b = _interopRequireDefault(require("./b.js"));

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    var a = {
      value: 'a',
      getA: function getA() {
        return _b["default"].value + 'from a.js';
      }
    };
    var _default = a;
    exports["default"] = _default;
  }
}, {
  key: "b.js",
  deps: ["a.js"],
  code: function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;

    var _a = _interopRequireDefault(require("./a.js"));

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    var b = {
      value: 'b',
      getB: function getB() {
        return _a["default"].value + 'from b.js';
      }
    };
    var _default = b;
    exports["default"] = _default;
  }
}, {
  key: "c.js",
  deps: [],
  code: function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.c = void 0;
    var c = {
      value: 'c'
    };
    exports.c = c;
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

console.log(modules)