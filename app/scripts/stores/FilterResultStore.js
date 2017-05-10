"use strict";
var Reflux = require('reflux');
var FilterResultAction = require('../actions/FilterResultAction');
var _ = require('_');

var FilterResultStore = Reflux.createStore({
  listenables:[FilterResultAction],
  _list:{},
  init: function() {
  },
  onSetData:function(data){
    this._list = data;
    this.trigger(data);
  },
  onGetData:function(){
    this.trigger(this._list);
  },

});

module.exports = FilterResultStore;
