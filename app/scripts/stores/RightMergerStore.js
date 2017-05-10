"use strict";
var Reflux = require('reflux');
var RightMergerActions = require('../actions/RightMergerActions');
// var MergerModal = require('../model/mergerModal');
import Model from '../model/mergerModal';
import FilterModal from '../model/filterModal';
const MergerModal = new Model();
var _ = require('_');

var RightMergerStore = Reflux.createStore({
  listenables: [RightMergerActions],
  obj: {
    head: {},
    pro: {},
    chart: {},
    table: {}
  },
  onSetData: function() {},
  onGetData: function(id) {
    var self = this;
    MergerModal.baseInfo(id, function(data) {
      self.obj.head=data;
      FilterModal.getPrice(data.stock_id,data.occur_time,function(_data){
        self.obj.chart = _data;
        self.trigger(self.obj);
      });
    });
  },

});

module.exports = RightMergerStore;
