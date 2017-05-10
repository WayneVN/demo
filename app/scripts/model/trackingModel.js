/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账"
 */


"use strict";
var http = require('../util/http.js');
var _ = require('_');

var TrackingModel = {
  clearData(cb) {
    const url = `/record/clear`;
    http.post(url, {}, (err, data) => cb(data));
  },

  // 获取标准化流水
  getStRecords(cb) {
    const url = `/tally-api/unified-records?page_size=99999&order=-1`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  // 所有文件上传状态
  getUploadsHistory(cb) {
    const url = `/record/history-status`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  // 查询最新一次文件上传状态
  getUploadsLatest(cb) {
    const url = `/record/latest-status`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  getTallyInfo(cb) {
    const url = `/tally-api/tally-info`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  //区间收益率
  getUserProfit(cb) {
    const url = `/tally-api/daily-profit-ratio`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  getClosePrices(indexid, startdate, enddate, cb) {
    /* indexid	无	指数ID
     * startdate	无	8位数字 如:20160110
     * enddate	无	8位数字 如:20160115, enddate必须大于startdate*/
    const params = `?indexid=${ indexid }&startdate=${ startdate }&enddate=${ enddate }`;
    const url = `/stockinfogate/indexqt/closeprices${ params }`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  // 帐户统计换手率
  getTurnoverRate(cb) {
    const url = `/tally-api/transaction-summary`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  // 累计盈亏及排名
  getUserAccumulative(cb) {
    const url = `/tally-api/user-accumulative-profit`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  getRecordinfo(cb) {
    const url = `/tally-api/record-info`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  getSetting(callback) {
    var url = '/tally-api/get-settings';
    http.get(url, (err, data) => {
      return callback(data);
    });
  },

  setSetting(param, callback) {
    var url = '/tally-api/set-settings';

    http.post(url, param, (err, data) => {
      callback(data)
    });
  },

  //持仓分类
  getUserPositionDist(cb) {
    const url = `/tally-api/user-position-dist`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  //个股盈亏
  getUserIncomeSums(cb) {
    const url = `/tally-api/user-income-sums`;
    http.get(url, (err, data) => {
      return cb(data);
    });
  }

};

module.exports = TrackingModel;
