/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "记账－抽奖模块"
 */

"use strict";
const http = require('../util/http.js');
const _ = require('_');

const LotteryModal = {
  // 抽奖
  draw(cb) {
    const url = '/stockinfogate/lottery/draw';

    http.post(url, {}, (err, data) =>{
      return cb(data);
    });
  },

  // 自己的获奖列表
  myprizes(cb) {
    const url = '/stockinfogate/lottery/myprizes';

    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  //奖品列表
  prizes() {
    const url = '/stockinfogate/lottery/prizes';

    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  count(cb) {
    const url = '/stockinfogate/lottery/userinfo';

    http.get(url, (err, data) => {
      return cb(data);
    });
  },

  //获取抽奖用收益率排名
  eratio(cb) {
    const url = '/stockinfogate/lottery/eratio';
    http.get(url, (err, data) => {
      return cb(data);
    });
  }
};

module.exports = LotteryModal;
