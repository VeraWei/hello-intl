var babelTemplate = require('babel-template');
var types = require("babel-types");
export default function () {
  return {
    visitor: {
      StringLiteral(path, state) {
        basic(path, state);
      },
      JSXText(path, state) {
        basic(path, state);
      },
      Program(path, state) {
        path.node.body.unshift('')
      }
    }
  }
}

function basic(path, state) {
    const index = Object.values(state.opts.str).indexOf(path.node.value);
    if (index >= 0) {
        var newValue = babelTemplate('I18n.get("' + Object.keys(state.opts.str)[index] + '")')();
        // path.node = newValue;
        var parentPath = path.parentPath;
        if ( /JSX/.test(parentPath.node.type) && parentPath.node.type !== 'JSXExpressionContainer') {
            path.replaceWith(types.JSXExpressionContainer(newValue.expression));
        } else {
            path.replaceWith(newValue.expression);
        }
    }
}

Object.values = function (obj) {
    var values = [];  
      for(var pro in obj){  
        values.push(obj[pro]);  
    }  
    return values;  
}