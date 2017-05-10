"use strict";
/**
 * 个股筛选两个按钮数据
 */

var Reflux = require('reflux');
var ContrastActions = require('../actions/ContrastActions');
var FilterModal = require('../model/filterModal');
var InternalModal = require('../model/internalModal');

var ContrastStore = Reflux.createStore({
  listenables: [ContrastActions],
  data: {},
  onSetData: function(id) {
    FilterModal.getMerge(id,(data)=>{
      this.data.merge = data;
      this.trigger(this.data);
    });
    InternalModal.getInternal(id,(data)=>{
      this.data.internal = data;
      this.trigger(this.data);
    });
  },
  onGetData: function() {
    this.trigger(this.data);
  },

});

module.exports = ContrastStore;
