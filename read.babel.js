var babelTemplate = require('babel-template');
var types = require("babel-types");
export default function () {
  return {
    visitor: {
      StringLiteral(path, state) {
        basic(path, state);
      },
      JSXText(path, state){
        basic(path, state);
      }
    }
  }
}

function basic(path, state) {
    if(/[\u4e00-\u9fa5]/.test(path.node.value)) {
      state.opts.stringNodes.push(path.node.value);
    }
}

Object.values = function (obj) {
    var values = [];  
      for(var pro in obj){  
        values.push(obj[pro]);  
    }  
    return values;  
}