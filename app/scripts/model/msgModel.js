/**
 * @file 消息神器请求model
 * @author min.chen@joudou.com
 */

var http = require('../util/http');

module.exports = {

    getList: function (params, callback) {
        http.post('/stockinfogate/announcement/query', params, callback);
    },

    getSelfStock: function (callback) {
        http.get('/stockinfogate/user/favorstock/list', callback);
    }

}