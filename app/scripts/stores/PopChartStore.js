"use strict";
var Reflux = require('reflux');
var PopChartActions = require('../actions/PopChartActions');
var FilterModal = require('../model/filterModal');
var time = require('../util/getTime');

var PopChartStore = Reflux.createStore({
  listenables:[PopChartActions],
  onSetData:function(obj){
    obj.time = time.allYear();
    var self = this;
    FilterModal.getChartData(obj,function(data){
      self.trigger(data);
    });
  },
});

module.exports = PopChartStore;
