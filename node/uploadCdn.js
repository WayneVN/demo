/**
 * @file 上传文件到cdn,基于七牛nodejs api:http://developer.qiniu.com/code/v6/sdk/nodejs.html#upload-flow
 * @author 杨骥
 */


var qiniu = require("qiniu");
var traverse = require('./traverse');
var path = require('path');
var fileDir = path.resolve(__dirname, '../dist');

var number = 0;
var RETRY_TIME = 3;

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'pehpuXBm8XgKP2cpPWkr38psT5QIaoz3AxuPwwIU';
qiniu.conf.SECRET_KEY = '2sNQEOwJdqL8hc-REzKYwUkhIdjbVo1DoKQP_rYN';

//要上传的空间
bucket = 'joudoucdn';



//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}


//构造上传函数
function uploadFile(uptoken, key, localFile, retryNum) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if (!err) {
            number ++;
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId, number);
        } else {
            // 上传失败， 处理返回代码
            console.log(err, localFile, number);
            if (retryNum < RETRY_TIME) {
                retryNum ++;
                uploadFile(uptoken, key, localFile, retryNum);
            }
            else {
                console.log('****************上传失败************');
            }
        }
    });
}

function upload() {
    traverse(fileDir, function(dir, file) {

        //要上传文件的本地路径
        filePath = path.join(dir, file);

        //上传到七牛后保存的文件名
        key = filePath.split(fileDir)[1];

        key = key.substr(1);

        //生成上传 Token
        token = uptoken(bucket, key);

        //调用uploadFile上传
        uploadFile(token, key, filePath, 0);
    });

}

upload();
