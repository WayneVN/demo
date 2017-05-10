"use strict";
var Reflux = require('reflux');
var SearchActions = require('../actions/SearchActions');


var SearchStore = Reflux.createStore({
  listenables:[SearchActions],
  onAutoGet:function(val){
  },
  onSearchGet:function(cb){
  }
});

module.exports = SearchStore;
