"use strict";
var Reflux = require('reflux');

var CheckActions = Reflux.createActions([
  'setData',
  'getData',
  'setInterCheck',
  'getInterCheck',
]);

module.exports = CheckActions;
