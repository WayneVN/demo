/**
 * @file url相关工具方法
 * @author min.chen@joudou.com
 */

var $ = require('jquery');

define(function (require, exports) {

    function getSearchObj() {
        var search = window.location.search;
        var temp;
        var result = {};

        search = search.substr(1);

        temp = search.split('&');
        $.each(temp, function (index, item) {
            var obj = item.split('=');

            if (obj[0]) {
                result[obj[0]] = obj[1];
            }
        });

        return result;
    }


    exports.getSearchObj =  getSearchObj;

    exports.getSearch = function (name) {
        var obj = getSearchObj();

        return obj[name];
    }

});