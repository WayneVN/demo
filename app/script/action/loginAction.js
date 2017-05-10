
"use strict";
var Reflux = require('reflux');

var LoginActions = Reflux.createActions([
  'userInfo',
  'setUser',
  'getUser',
  'Replace',
  'reload',
  'clearUser',
]);

module.exports = LoginActions;
