"use strict";
/**
 * 右侧 筛选结果－－ 三级页面
 */
var React = require('react');
var Component = require('react').Component;
var Link = require('react-router').Link;
var Reflux = require('reflux');
var echarts = require('echarts/lib/echarts');;
var ChartStore = require('../stores/ChartStore');
var ChartActions = require('../actions/ChartActions');
var PopChartActions = require('../actions/PopChartActions');
var chartTmpl = require('../util/chartTmpl');
var _ = require('_');
var theme = require('echarts/theme/macarons');
var numeral = require('numeral');

require('echarts/lib/chart/k');

var K = React.createClass({
  getDefaultProps: function() {
    return {
      data: {},
      stockId: ""
    };
  },

  getInitialState: function() {
    return {
      name: this.props.name,
      option: chartTmpl.k,
      time: ''
    };
  },

  initChart: function() {
    var list = [];
    var Ylist = [];
    if (_.isEmpty(this.props.data.chart) || !this.props.data.chart || this.props.data.chart.length == 0) {
      return;
    }
    if (!this.isMounted()) {
      this.forceUpdate();
    }
    var prev_data = this.props.data.chart.prev_trade_data;
    var xData = this.props.data.chart.data;
    var dataList = this.state.option;
    var _index = [];



    for (var i = 0; i < xData.length; i++) {
      // x轴 上的时间
      list.push(xData[i].date);
      var _list = [
        numeral(parseFloat(xData[i].open_price)).format('0.00'),
        numeral(parseFloat(xData[i].closing_price)).format('0.00'),
        numeral(parseFloat(xData[i].low_price)).format('0.00'),
        numeral(parseFloat(xData[i].high_price)).format('0.00')
      ];
      // 取出一字板
      if (_list[0] == _list[1] && _list[2] == _list[3]) {
        _index.push({
          k: i,
          v: _list[0]
        });
      }
      Ylist.push(_list);
    }
    // 涨停板
    var _upIndex = [];

    for (var i = 0; i < _index.length; i++) {
      // 取所有非首个的一字板，因为首个一字板没法对比
      if (_index[i].k != 0) {
        for (var j = 0; j < _index.length; j++) {
          // 获取当前一字板的上一个相邻一字板，并且当前一字板大于上个一字板，判定为涨停板
          if (_index[i].k - 1 == _index[j].k && _index[i].v > _index[j].v) {
            _upIndex.push({
              k: _index[i].k,
              v: _index[i].v
            });
          }
        }
      }
      else {
        if (prev_data.open_price ) {
          if (_index[0].v > prev_data.open_price) {
            _upIndex.push({
              k: _index[0].k,
              v: _index[0].v
            });
          }
        }
      }
    }
    // 改变涨停板填充色
    for (var i = 0; i < _upIndex.length; i++) {
      Ylist[_upIndex[i].k] = {
        value: [
          _upIndex[i].v, _upIndex[i].v, _upIndex[i].v, _upIndex[i].v
        ],
        itemStyle: {
          normal: {
            color0: '#D87A80',
            lineStyle: {
              width: 1,
              color0: '#D87A80'
            }
          },
          emphasis: {
            lineStyle: {
              width: 1,
              color0: '#D87A80'
            }
          }
        }
      }
    }

    dataList.xAxis[0].data = list;
    dataList.series[0].data = Ylist;
    // 渲染图表
    var node = this.refs.chart.getDOMNode();
    var mychart = echarts.init(node, theme);
    mychart.setOption(dataList);
  },
  componentDidMount: function() {
    this.initChart();
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.initChart();
  },
  openFull: function() {
    let {stockId} = this.props;
    PopChartActions.setData(stockId);
  },
  render: function() {
    return (
      <div className='chart-lg' ref="chart"></div>
    );
  }
});

module.exports = K;
