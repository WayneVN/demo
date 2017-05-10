/**
 * Created by whc on 16/4/7.
 * 自选股
 */
"use strict";
var Reflux = require('reflux');

var StockAction = Reflux.createActions([
  'getList',
  'addStock',
  'delStock',
  'setTop',
]);

module.exports = StockAction;
