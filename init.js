var fs = require("fs");
var dir1 = './src';
var dir2 = './app';
var dirArray = [dir1, dir2];

dirArray.map(function(dir) {
    const localePath = dir + '/locale';
    if(fs.existsSync(dir) && !fs.existsSync(localePath)) {
        fs.mkdirSync(localePath);
        fs.writeFile(localePath+'/i18n.js', '', function(error){
            if(error) throw error;
            console.log('i18n 写入成功');
        });
        fs.writeFile(localePath+'/zh.js', '', function(error){
            if(error) throw error;
            console.log('zh 写入成功');
        });
    } else {
        return;
    }
})
  