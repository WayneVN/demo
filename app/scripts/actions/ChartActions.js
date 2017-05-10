"use strict";
var Reflux = require('reflux');

var ChartActions = Reflux.createActions([
  'setData',
  'getData',
]);

module.exports = ChartActions;
