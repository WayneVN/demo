"use strict";
var Reflux = require('reflux');
var ChartActions = require('../actions/ChartActions');
var FilterModal = require('../model/filterModal');
var _ = require('_');

var ChartStore = Reflux.createStore({
  listenables: [ChartActions],
  chartData: {},
  onSetData: function(chart) {
    var self = this;
    // 缓存图表数据，如果不缓存每次拉数据的时候会触发state，组件会render，太操蛋了。
    if (chart.init) {
      FilterModal.getChartData(chart, function(data) {
        self.chartData[chart.dataName] = data;
        self.trigger(self.chartData);
      });
    } else {
      self.trigger(self.chartData[chart.dataName]);
    }
  },
  onGetData: function() {
    this.trigger(self.chartData);
  },

});

module.exports = ChartStore;
