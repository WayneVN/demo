"use strict";
var Reflux = require('reflux');

var InternalActions = Reflux.createActions([
  'setEvent',
  'removeEvent',
  'getAll',
  'setSelect',
  'initInternalRange',
  'changeSelect',
  'page'
]);

module.exports = InternalActions;
