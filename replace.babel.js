var babelTemplate = require('babel-template');
var types = require("babel-types");
var pathModel = require("path");
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
        var str = state.opts.file.split('/')[0] + '/locale/i18n';
        var i18nStrPath = pathModel.relative(state.opts.file, str);
        var node = importNode('I18n', i18nStrPath);
        path.node.body.unshift(node);
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

function importNode(arg1, arg2) {
    return types.ImportDeclaration(
        [
            types.ImportSpecifier(
                types.identifier(arg1),
                types.identifier(arg1)
            ),
        ],
        types.stringLiteral(arg2)
    )
}
