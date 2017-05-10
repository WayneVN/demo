"use strict";
var Reflux = require('reflux');

var MergerResultActions = Reflux.createActions([
  'setList',
  'changeData',
  'getData',
]);

module.exports = MergerResultActions;
