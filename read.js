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

glob("app/**/*.js", {}, function(err, files){
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
        [plugin, {stringNodes: {
            push: function(item){
              // 去重处理
              if (stringNodes.indexOf(item) < 0) {
                stringNodes.push(item);
              }
            }
          }, file}]]
    });

    fs.exists('zh.js', function(exists) {
        if (!exists) {
            const resultNode = 'export default {\n  "": "'+stringNodes.join('",\n  "": "')+'"\n}'
            writeFile('zh.js', resultNode);
        }
    })
  })
}

var index = 0;
function writeFile(to, result) {
  fs.writeFile(to, result, function(error){
    if(error) throw error;
    console.log(index++, '写入成功');
  });
}

