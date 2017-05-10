/**
 * @file 定增页面请求model
 * @author min.chen@joudou.com
 */

var http = require('../util/http');

module.exports = {

    getList: function (pageNum, callback) {
        pageNum = pageNum || 1;
        http.get(`/private-placement/events?page_num=${pageNum}&page_size=15`, callback);
    },

    getDetail: function (id, callback) {
        http.get(`/stockinfogate/private/${id}`, callback);
    }


}