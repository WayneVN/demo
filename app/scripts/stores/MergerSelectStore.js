"use strict";
var Reflux = require('reflux');
var MergerSelectActions = require('../actions/MergerSelectActions.js');
var ResultActions = require('../actions/ResultActions.js');
var FilterActions = require('../actions/FilterActions.js');

// 缓存个股筛选第一个筛选条的min-max值，如果不存，呵呵...
var MergerSelectStore = Reflux.createStore({
  listenables:[MergerSelectActions],
  _data:null,
  onGetAll:function(){
    this.trigger(this._data);
  },
  onSetAll:function(obj){
    this._data = obj;
    this.trigger(obj);
  },
});

module.exports = MergerSelectStore;
