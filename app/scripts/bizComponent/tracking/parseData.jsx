/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "数据解析"
 */

"use strict";
const _ = require('_');
const moment = require('moment');
const numeral = require('numeral');

const initLimit = 220;

const ParseData = {
  userData: [], // 解析前的原始数据
  indexData: [],
  parseUserData: [], //解析后直接使用的用户收益数据
  parseIndexData: [], //解析后可以直接使用的指数数据
  prev_trade_date: '',
  limit: false,

  initUserData(arr, intPrevTradeDate) {
    this.prev_trade_date = intPrevTradeDate;
    this.setUserData(arr);
    return  this.parseUser();
  },

  initIndexData(arr) {
    this.setIndexData(arr);
    return this.parseIndex();
  },

  // 存入用户原始数据
  setUserData(arr) {
    this.userData = arr;
  },

  // 存入当前指数原始数据
  setIndexData(arr) {
    this.indexData = arr;
  },

  // 直接读取解析后的数据供外部使用
  getParseData(type) {
    if (type == 'index') {
      return this.parseIndexData;
    }
    if (type == 'user') {
      return this.parseUserData;
    }
  },

  //解析用户数据，初始化
  parseUser() {
    let list = [];
    let len = this.userData.length;

    for (let i = 0; i < len; i++) {
      list.push(this.userData[i]);
    }

    let newList = [];
    _.reduce(list, (sum, n) => {
      let _sum = sum * (1 + n.day_profit_ratio);
      let obj = _.cloneDeep(n);
      obj.val = (_sum - 1).toFixed(5);
      newList.push(obj);
      return _sum;
    }, 1);
    this.parseUserData = newList;

    return newList;
  },

  //解析用户数据 指定时间
  _parseUser(begtime, endtime) {
    begtime = begtime ? moment(begtime.toString()).format('YYYYMMDD') : moment().format('YYYYMMDD');
    endtime = endtime ? moment(endtime.toString()).format('YYYYMMDD') : moment().format('YYYYMMDD');
    let list = [];
    let newList = [];

    let begIndex = _.findIndex(this.userData, {
      'date': begtime
    });
    let endIndex = _.findIndex(this.userData, {
      'date': endtime
    });

    if (begIndex == -1) {
      this.userData.map((item, index) => {
        if (item.date < begtime) {
          begIndex = index+1;
        }
      });
      if (begIndex == -1) {
        begIndex=0;
      }
    }
    if (endIndex == -1) {
      this.userData.map((item, index) => {
        if (item.date <= endtime) {
          endIndex = index;
        }
      });
    }
    if (endIndex == -1) {
      endIndex = this.userData.length-1;
    }


    for (let i = begIndex; i <= endIndex; i++) {
      if (i < this.userData.length) {
        list.push(this.userData[i]);
      }
    }
    _.reduce(list, (sum, n) => {
      let _sum = sum * (1 + n.day_profit_ratio);
      let obj = _.cloneDeep(n);
      obj.val = (_sum - 1).toFixed(5);
      newList.push(obj);
      return _sum;
    }, 1);

    this.parseUserData = newList;

    return newList;
  },

  // 解析指定时间段内的指数
  _parseIndex(begtime, endtime) {
    begtime = begtime ? moment(begtime.toString()).format('YYYYMMDD') : moment().format('YYYYMMDD');
    endtime = endtime ? moment(endtime.toString()).format('YYYYMMDD') : moment().format('YYYYMMDD');
    let list = [];
    let newList = [];

    let begIndex = _.findIndex(this.indexData, {
      'date': begtime
    });
    let endIndex = _.findIndex(this.indexData, {
      'date': endtime
    });
    if (begIndex == -1) {
      this.indexData.map((item, index) => {
        if (item.date < begtime) {
          begIndex = index+1;
        }
      });
    }
    if (endIndex == -1) {
      this.indexData.map((item, index) => {
        if (item.date <= endtime) {
          endIndex = index;
        }
      });
    }

    for (let i = begIndex; i <= endIndex; i++) {
      list.push(this.indexData[i]);
    }

    let _prev = _.findIndex(this.indexData, {'date': list[0].date});
    // 计算指数需要基准日，具体的看wiki
    let prevDay =  this.indexData[_prev-1];
    _.map(list, (item, key) => {
      newList.push({
        date: item.date,
        val: (item.close / prevDay.close - 1).toFixed(5)
      });
    });

    this.parseIndexData = newList;
    return newList;
  },

  // 解析指数->初始化才用
  parseIndex() {
    let list = [];
    let begIndex = _.findIndex(this.indexData, {
      'date': this.userData[0].date.toString()
    });
    let endIndex = _.findIndex(this.indexData, {
      'date': this.userData[this.userData.length-1].date.toString()
    });

    for (let i = begIndex; i <= endIndex; i++) {
      list.push(this.indexData[i]);
    }

    let prevDay =  _.find(this.indexData, {'date': this.prev_trade_date.toString()});
    let newList = [];
    _.map(list, (item, key) => {
      newList.push({
        date: item.date,
        val: (item.close / prevDay.close - 1).toFixed(5)
      });
    });

    this.parseIndexData = newList;
    return newList;
  },

};

module.exports = ParseData;
