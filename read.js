require("babel-register")({
  "presets": [
    "env",
    "stage-0",
  ]
});
var plugin = require("./read.babel").default;
var babel = require("babel-core");
var fs = require("fs");
var glob = require("glob");

var stringNodes = [];

glob("*(app|src)/*(components|view|layout|page|service|constant)/**/*.js", {}, function(err, files){
  files.map(function(file){
    readFile(file);
  })
})

glob("*(app|src)/*.js", {}, function(err, files){
  files.map(function(file){
    readFile(file);
  })
})


function readFile (file) {
  fs.readFile(file, "utf8", function(error, bytesRead){
    if (error) throw error;
    const result = babel.transform(bytesRead, {
      plugins: [
        'syntax-jsx',
        "transform-object-rest-spread",
        "transform-function-bind",
        "transform-class-properties",
        [plugin, {stringNodes: {
            push: function(item){
              // 去重处理
              if (stringNodes.indexOf(item.trim()) < 0) {
                console.log('item', item)
                stringNodes.push(item.trim());
              }
            }
          }, file}]]
    });

    const resultNode = 'export default {\n  "": "'+stringNodes.join('",\n  "": "')+'"\n}'
    writeFile('zh.js', resultNode);
  })
}

var index = 0;
function writeFile(to, result) {
  fs.writeFile(to, result, function(error){
    if(error) throw error;
    console.log(index++, '写入成功');
  });
}

