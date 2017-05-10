"use strict";
var $ = require('jquery');

var requestIdList = {};

const http = {
    get: function(url, callback) {
        request('GET', url, callback);
    },
    post: function(url, obj, callback) {
        request('POST', url, callback, obj);
    }
};


function getBaseUrl() {
    var baseUrl = '';
    if ('production' != process.env.NODE_ENV) {
        // baseUrl = 'https://test.joudou.com';
    }
    return baseUrl;
}

function request(type, url, callback, obj) {
    var baseUrl = getBaseUrl();
    url = baseUrl + url;

    var requestId = getRequestId(url);

    if(url.indexOf("\?") < 0) {
      url += '?_t=' +new Date().getTime();
    }else {
      url += '&_t=' +new Date().getTime();
    }

    $.ajax({
        url: url,
        data: obj,
        type: type,
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: function(data) {
            checkRequestId(requestId, url)
            .done(function () {
                callback(null, data);
            });
        },
        error: function(err) {
            checkRequestId(requestId, url)
            .done(function () {
                callback(err, null);
            });
        }
    });
}

function getRequestUrl(url) {
    return url.split('?')[0];
}

function getRequestId(url) {
    var requestUrl = getRequestUrl(url);
    var requestId = +new Date() + Math.random();

    requestIdList[requestUrl] = requestIdList[requestUrl] || [];
    requestIdList[requestUrl].push(requestId);

    return requestId;
}

function checkRequestId(requestId, url) {
    var promise = $.Deferred();
    var requestUrl = getRequestUrl(url);
    var index = $.inArray(requestId, requestIdList[requestUrl]);

    if (index > -1) {
        promise.resolve();
        requestIdList[requestUrl].splice(0, index);
    }

    return promise;
}

module.exports = http;
