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
var format = require('../util/format');
var theme = require('echarts/theme/macarons');

require('echarts/lib/chart/bar');

var ChartBar = React.createClass({
  getDefaultProps: function() {
    return {
      data: {},
      stockId: ""
    };
  },
  getInitialState: function() {
    return {
      option: chartTmpl.bar
    };
  },
  initChart: function() {
    var Xlist = [];
    var Ylist = [];
    if (_.isEmpty(this.props.data)) {
      return ;
    }
    if (!this.isMounted()) {
      this.forceUpdate();
    }
    var xData =  this.props.data.totals;
    var dataList = this.state.option;
    Xlist.push('LTM');
    var LTM = {
      value:this.props.data.ltm.value,
      itemStyle: {
        normal: {
            color: '#ff742f',
            label: {
                show: true,
                textStyle: {color: '#ff742f'},
                position: 'top',
                formatter: function (item) {
                    return format.myriadFormat(item.value);
                }
            }
        }
      }
    }
    Ylist.push(LTM);
    for (var i = 0; i < xData.length; i++) {
      // 过滤所有为0的数据
      /* if (xData[i].value != 0) {*/
        // x轴 上的时间
        Xlist.push(xData[i].key);
        Ylist.push(xData[i].value);
      /* }*/
    }
    dataList.xAxis[0].data = Xlist;
    dataList.series[0].data = Ylist;

    // 渲染图表
    var node = this.refs.chart.getDOMNode();
    var mychart = echarts.init(node,theme);
    mychart.setOption(dataList);
  },
  componentDidMount: function() {
    this.initChart();
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.initChart();
  },
  render: function() {
    return (
      <div style={{position:'relative'}}>
        <div className='chart-md' ref="chart"> </div>
        <ul className="lengend">
          <li><span className="color-org"></span>收购方</li>
          <li><span className="color-blue"></span>被收购方</li>
        </ul>
      </div>
    );
  }
});

module.exports = ChartBar;
