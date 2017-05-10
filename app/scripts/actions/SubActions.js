"use strict";
const Reflux = require('reflux');

const SubActions = Reflux.createActions([
  'setSub',
  'setVir',
  'getPath',
  'initStatus',

  ///whc
  'getSubId',
  'setSubId',


]);

module.exports = SubActions;
