"use strict";
var Reflux = require('reflux');

var FilterActions = Reflux.createActions([
  'getAll',
  'getAllInit',
  'setFilters',
  'getFilters',
  'setSelect',
  'getSelect',
  'initRange',
  'setNums',
  'removeSelect',
  'sortKey',
  'setPageNum',
  'setSortKey',
  'clearData',
  'selectSearch'
]);

module.exports = FilterActions;
