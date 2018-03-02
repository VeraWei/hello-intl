/*
import * as babylon from "babylon";
import traverse from "babel-traverse";
import * as t from "babel-types";
import generate from "babel-generator";

const code = `function square(n) {
    return n * n;
}`;

const ast = babylon.parse(code);
/*
traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
*/

require("babel-register")({
  "presets": [
    "env",
    "stage-0"
  ]
});
var plugin = require("./main").default;
var babel = require("babel-core");

const result = babel.transform("xxxx===yyyy", {
  plugins: [plugin]
});

console.log(result);
/*
traverse(ast, {
  enter(path) {
    if(t.isIdentifier(path.node, {name: "n"})) {
      path.node.name = "x";
    }
  }
});

generate(ast, null, code)

console.log(ast);
*/
