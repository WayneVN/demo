/**
 * @file 个股弹窗页面请求model
 * @author min.chen@joudou.com
 */

var http = require('../util/http');
var config = require('../bizComponent/stockDialog/config');

module.exports = {

    getData: function (stockId, callback) {
        http.get(`/stockinfogate/stock/dashboard2/${stockId}`, callback);
    },

    getSelfStock: function (callback) {
        http.get('/stockinfogate/user/favorstock/list', callback);
    },


    /**
     * 获取k线图数据
     * 
     * @param {string} stockId  个股代码
     * @param {Function} callback
     */
    getChartData: function (stockId, callback) {
        http.get(`/stockinfogate/kchartdata/${stockId}`, callback);
    },

    /**
     * 获取折线线图数据
     * 
     * @param {string} stockId  个股代码
     * @param {number} type  类型
     * @param {Function} callback
     */
    getLineData: function (stockId, type, callback) {
        var name = config.rankTypeField[type];

        http.get(`/stockinfogate/stock/${name}/${stockId}`, callback);
    },
}