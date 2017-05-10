"use strict";
const Reflux = require('reflux');

const SublistActions = Reflux.createActions([
  'setList',
  'getList'
]);

module.exports = SublistActions;
