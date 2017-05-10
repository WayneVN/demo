/**
 * @file mock接口
 * @author 杨骥
 */

module.exports = function(grunt) {

    var fileToRead = "../mock/main";
    var response = require(fileToRead).response;

    var mock = function(req, res, next) {

        var keys = '';


        var path = req.url.split('/').join('_');

        path = path.split('?')[0];

        console.log(path);
        var mockPath = getMockPath(path);

        if (response[mockPath]) {

            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            if (req.method === 'POST') {
                req.on('data', function(data) {
                    console.log(data, 'data');
                });

                req.on('end', function() {
                    res.end(
                        JSON.stringify(
                            response[mockPath]()
                        )
                    );
                });

            } else {

                res.end(
                    JSON.stringify(
                        response[mockPath](req.url)
                    )
                );
            }
        }
        else {
            return next();
        }

    };


    function getMockPath(path) {
        var result = path;
        var temp;

        for (var k in response) {
            if (k.indexOf('*') > -1) {
                temp = k.replace('*', '');
                if (path.indexOf(temp) === 0) {
                    result = k;
                }
            }

        }

        return result;
    }

    return mock;

};
