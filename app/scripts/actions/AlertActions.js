"use strict";
var Reflux = require('reflux');

var AlertActions = Reflux.createActions([
  'open',
  'success',
  'error',
  'warn',
]);

module.exports = AlertActions;
