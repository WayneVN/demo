"use strict";
var Reflux = require('reflux');
var SimilarsActions = require('../actions/SimilarsActions');
var FilterModal = require('../model/filterModal');
var _ = require('_');

var SimilarsStore = Reflux.createStore({
  listenables: [SimilarsActions],
  onSetData: function(chart) {
  },
  onGetData: function() {
    this.trigger(self.chartData);
  },

});

module.exports = SimilarsStore;
