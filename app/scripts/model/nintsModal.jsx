'use strict';
/**
 * 每日一股相关请求
 * @type {*|exports|module.exports}
 */
var http = require('../util/http');
var _ = require('_');
var TagModal = require('./tagModal');
var Calculation = require('../util/calculation');

var NintsModal = {
  /**
   * 获取每日一股
   * @param date date对象
   */
    getNints(dateStr, callback) {
      //股票价格等信息
      var stcokInfoUrl = `/daily-stock/show${dateStr ? '?date='+dateStr : ''}`;

      http.get(stcokInfoUrl, (error, nints) => callback(nints) );
    },

    //点赞
    addGood(stock_id, dataStr, hasBad, callback) {

      if(hasBad){
        this._postGoodOrBad(false, stock_id, dataStr, () => {});
      }

      this._postGoodOrBad(true, stock_id, dataStr, callback);
    },

    //点踩
    addBad(stock_id, date, hasGood, callback) {
      if(hasGood){
        this._postGoodOrBad(true, stock_id, date, () => {});
      }

      this._postGoodOrBad(false, stock_id, date, callback);
    },

    //发送点或者赞
    _postGoodOrBad(isGood, stock_id, dataStr, callback) {

      var url = isGood ? `/click/up` : `/click/down` ;
      http.post(url,{
        stock_id: stock_id,
        date: dataStr
      }, callback);
    },

};

module.exports = NintsModal;

