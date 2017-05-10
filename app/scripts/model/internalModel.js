/**
 * @file 内部交易页面请求model
 * @author min.chen@joudou.com
 */

var http = require('../util/http');

module.exports = {

    getDetail: function (id, callback) {
        http.get(`/stockinfogate/internal/${id}`, callback);
    }


}