"use strict";
var Reflux = require('reflux');
var AddStockActions = require('../actions/AddStockActions');

var AddStockStore = Reflux.createStore({
  listenables: [AddStockActions],

  onRefresh: function(){
    this.trigger();
  },

});

module.exports = AddStockStore;
