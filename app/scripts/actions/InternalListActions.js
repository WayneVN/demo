"use strict";
var Reflux = require('reflux');

// 内部交易二级页面
var InternalListActions = Reflux.createActions([
  'setData',
  'getData',
  'init',
  'setSortKey',
  'setPageNum'
]);

module.exports = InternalListActions;
