"use strict";
/**
 * 右侧 筛选结果－－ 三级页面
 */
var React = require('react');
var Component = require('react').Component;
var Link = require('react-router').Link;
var Reflux = require('reflux');
var echarts = require('echarts/lib/echarts');;
var chartTmpl = require('../util/chartTmpl');
var _ = require('_');
var format = require('../util/format');
var theme = require('echarts/theme/macarons');

require('echarts/lib/chart/pie');

var ChartPie = React.createClass({
  getDefaultProps: function() {
    return {
      data:{},
      id:''
    };
  },
  getInitialState: function() {
    return {
      option: chartTmpl.pie,
    };
  },
  initChart: function() {
    // 防止空数据出现
    if (!this.props.data.merged) {
      return ;
    }
    if (!this.isMounted()) {
      this.forceUpdate();
    }
    var option = this.state.option;
    var dataList = this.props.data.merged.companies[0];
    // 填充合并后的圆心
    option.series[1].data = [{
      name: dataList.name,
      value: dataList.market_value,
      itemStyle: {
        normal: {
          color: '#304c7c'
        }
      }
    }];

    // 渲染外环的圆
    option.series[0].data = (function(){
      var sum =0
      var init = true;
      for (var i = 0; i < dataList.stockholders.length; i++) {
        sum += parseFloat(dataList.stockholders[i].value);
      }
      for (var i = 0; i < dataList.stockholders.length; i++) {
        if (dataList.stockholders[i].name=='其他') {
          init = false;
        }
      }
      if (init) {
        dataList.stockholders.push({name:'其他', value:1-sum});
      }
      return dataList.stockholders;
    })();
    var colors = [
      '#f4595b',
      '#ed8b65',
      '#efca58',
      '#a6cbc1',
      '#61a3d9',
      '#7e72c0'
    ];

    //把外层的图表上个色
    option.series[0].data = _.sortBy(option.series[0].data, o => -o.value );
    for (var i = 0; i < 6; i++) {
      option.series[0].data[i].itemStyle = {
        normal: {
          color: colors[i]
        }
      };
    }
    // 渲染图表右侧列表
    option.legend.data = (function(){
      var list = [];
      for (var i = 0; i < dataList.stockholders.length; i++) {
        list.push(dataList.stockholders[i].name);
      }
      return list;
    })();
    var node = this.refs.chart.getDOMNode();
    var mychart = echarts.init(node,theme);
    mychart.setOption(option);
  },
  componentDidMount: function() {
    this.initChart();
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.initChart();
  },
  render: function() {
    return (
      <div className='chart-sm' ref="chart"> </div>
    );
  }
});

module.exports = ChartPie;
