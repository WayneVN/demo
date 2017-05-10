"use strict";
var Reflux = require('reflux');
var ResultActions = require('../actions/ResultActions');


var ResultStore = Reflux.createStore({
  listenables:[ResultActions],
  _data:[],
  init: function() {
  },
  onSetData:function(data){
    this._data = data;
    // http
  },
  onGetData:function(cb){
    this.trigger(this._data);
    return cb(this._data);
  }
});

module.exports = ResultStore;
