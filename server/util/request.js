var request = require('request');
var _ = require('lodash');
var urlController = require('./urlController');

var parseResToJSONAndSend = (callback) =>
    (err, resp, data) => {
        if (err) {
            console.log("Response err", err);
        } else if (resp.statusCode < 200 || resp.statusCode > 299) {
            console.log("Status code not in range 200..299:", resp.statusCode, resp.request.uri.href);
        } else {
            console.log(resp.request.uri.href, resp.statusCode);
            try {
                callback(data);
            } catch (e) {
                console.log("Err in JSON parse", e);
            }
        }
    };

var send = (req, options, callback) => {
        var jar = request.jar();
        var baseUrl = getURLPrefix(req);
        setCookie(jar, req, baseUrl);

        var defaultOptions = {
            baseUrl: baseUrl,
            method: 'GET',
            encoding: 'utf8',
            header: {
                'Content-Type': 'application/json'
            },
            jar: jar
        }
        var opt = _.cloneDeep(options || {});

        if (_.isFunction(options)) {
            opt = _.assign({}, defaultOptions, options(req));
        }
        else if (_.isObject(options)) {
            opt = _.assign({}, defaultOptions, opt);
        }

        request(opt, parseResToJSONAndSend(callback));
    };

function getURLPrefix(req) {
    var env = urlController.getEnv(req);

    if (env == 'local') {
        // env = 'test';
        return 'http://localhost:3000'
    }
    return 'https://' + env + '.joudou.com';
}

function setCookie(jar, req, baseUrl) {
    var cookies = req.header('Cookie') || '';
    var temp = cookies.split(';');

    temp.forEach(function (item) {
        jar.setCookie(item, baseUrl);
    })
}

module.exports = send;
