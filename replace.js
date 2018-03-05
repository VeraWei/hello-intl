require("babel-register")({
  "presets": [
    "env",
    "stage-0",
  ]
});
var plugin = require("./replace.babel").default;
var babel = require("babel-core");
var fs = require("fs");
var glob = require("glob");
var str = require('./zh').default;

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
        [plugin, {str}]]
    });
    writeFile(file, result.code);
  })
}

var index = 0;
function writeFile(to, result) {
  fs.writeFile(to, result, function(error){
    if(error) throw error;
    console.log(index++, '写入成功');
  });
}
