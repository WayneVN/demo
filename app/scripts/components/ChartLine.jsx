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
var ModalSwitchActions = require('../actions/ModalSwitchActions');
var format = require('../util/format');
var numeral = require('numeral');
var _ = require('_');
var theme = require('echarts/theme/macarons');

require('echarts/lib/chart/line');

var ChartLine = React.createClass({
  getDefaultProps: function() {
    return {
      data: {},
      stockId:"",
    };
  },
  getInitialState: function() {
    return {
      name: this.props.name,
      dataName: this.props.dataName,
      option:chartTmpl.line,
      time: '',
    };
  },
  initChart: function() {
    var list = [];
    var Prices = [];
    if (this.props.data.length==0) {
      return ;
    }
    if (!this.isMounted()) {
      this.forceUpdate();
    }
    if (this.props.active=='active' && this.isMounted()) {
      var xData =  this.props.data;
      var dataList = this.state.option;
      var dataParse = format.chartFormat(xData,this.props.dataName);
      var xData = dataParse.data;
      var dataCompany = dataParse.dataCompany;
      for (var i = 0; i < xData.length; i++) {
        // x轴 上的时间
        list.push(xData[i].date || 0);
        Prices.push(parseFloat(xData[i].val || 0)); //转换精度，否则计算错误
      }
      dataList.yAxis[0].axisLabel.formatter = '{value}'+dataCompany;
      dataList.xAxis[0].data = list;
      dataList.series[0].data = Prices;
      dataList.series[0].name = this.props.title;

      // 将最新一天的值给渲染出来
      dataList.series[0].markPoint.data[2].symbolSize =4;
      dataList.series[0].markPoint.data[2].value =Prices[Prices.length-1];
      dataList.series[0].markPoint.data[2].xAxis =list[list.length-1];
      dataList.series[0].markPoint.data[2].yAxis =Prices[Prices.length-1];

      // label之间的间隔
      if (xData.length<10) {
          dataList.xAxis[0].axisLabel.interval = 'auto';
      }
      if(xData.length>730){
        dataList.xAxis[0].axisLabel.interval = 365;
      }
      if (xData.length>10 && xData.length<730 ) {
        dataList.xAxis[0].axisLabel.interval = 30;
      }
      dataList.dataZoom = {show:false};
      // 渲染图表
      var node = this.refs.chart.getDOMNode();
      var mychart = echarts.init(node,theme);
      mychart.setOption(dataList);
    }
  },
  componentDidMount:function(){
    this.initChart();
  },
  componentDidUpdate:function(prevProps,  prevState){
    this.initChart();
  },
  openFull:function(){
    ModalSwitchActions.openModal();
    PopChartActions.setData({id:this.props.stockId,dataName:this.props.dataName});
  },
  render: function() {
    var str = this.props.active==''?'panel-chat  hide':'panel-chat ';
    return (
      <div className={str}>
        <div className="panel-head">
          <p className="panel-l-name">{this.props.name}</p>
          <p className="panel-l-title">{this.props.title}</p>
        </div>
        <div className="panel-body">
          <div className={this.props.clazz} ref="chart"/>
          <a href="javascript:;" className="btn-full" onClick={this.openFull}>查看大图</a>
        </div>
      </div>
    );
  }
});

module.exports = ChartLine;
