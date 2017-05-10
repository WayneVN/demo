/**
 * @file 斗米
 * @author min.chen@joudou.com
 */

var http = require('../util/http');
var userInfo = require('../util/userInfo');


module.exports = {

    getEntryData: function (callback) {

        http.get(`/stockinfogate/doumi/pool/current`, callback);
    },


    bet: function (data, callback) {

        http.get(`/stockinfogate/doumi/pool/dobet?poolid=${data.id}&pooloption=${data.option}&amount=${data.amount}`, callback);
    },


    getHistory: function (callback) {
        http.get(`/stockinfogate/doumi/pool/userpoolhistory`, callback);
    },

    getPoolData: function (id, callback) {

        http.get(`/stockinfogate/doumi/pool/userpoolresult?poolid=${id}`, callback);
    }

}