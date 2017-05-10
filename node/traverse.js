/**
 * @file 遍历文件系统
 * @author 杨骥
 */

var fs = require('fs');
var path = require('path');

function traverse(dir, callback) {
    fs.readdir(dir, function (error, files) {
        if (error) {
            console.error(err);
        }
        else if (files.length > 0) {
            files.forEach(function (file) {

                var fullPath = path.join(dir, file);

                fs.stat(fullPath, function (err, stats) {

                    if (stats.isDirectory()) {
                        traverse(fullPath, callback);
                    }
                    else {
                        callback(dir, file);
                    }
                });
            });
        }
    });
    
}

module.exports = traverse;

// demo
//
// traverse(path.resolve(__dirname, '../dist'), function (dir, file) {
//     console.log(path.join(dir, file));
// });