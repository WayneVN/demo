"use strict";
/**
 * 右侧 筛选结果－－ 一级页面
 */
var React = require('react');
var Link = require('react-router').Link;
var Reflux = require('reflux');
var echarts = require('echarts/lib/echarts');
var ChartStore = require('../stores/ChartStore');
var ChartActions = require('../actions/ChartActions');
var PopChartActions = require('../actions/PopChartActions');
var chartTmpl = require('../util/chartTmpl');
var ModalSwitchActions = require('../actions/ModalSwitchActions');
var _ = require('_');
var format = require('../util/format');
var numeral = require('numeral');

require('echarts/lib/chart/line');

var EchartLine = React.createClass({
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
  initBigChart:function(){
    var list = [];
    var Prices = [];
    var dataZoom = {
        show:true,
        start:90,
        end:100,
    }
    if (!this.props.data || this.props.data.length==0) {
      return;
    }
    // 一定要判断this.isMounted() 否则报错
    if (this.props.active=='active' && this.isMounted()) {
      // 数据格式转换
      var dataParse = format.chartFormat(this.props.data,this.props.dataName);
      var xData = dataParse.data;
      var dataCompany = dataParse.dataCompany;
      var name = dataParse.name;
      for (var i = 0; i < xData.length; i++) {
        // x轴 上的时间
        list.push(parseInt(xData[i].date) || 0);
        // x轴上的数字
        Prices.push(parseFloat(xData[i].val)||0); //转换精度，否则计算错误
      }
      var dataList = this.state.option;
      dataList.series[0].name = name;
      dataList.xAxis[0].data = list;
      // 改变单位
      dataList.yAxis[0].axisLabel.formatter = '{value}'+dataCompany;
      dataList.tooltip.formatter = '日期:{b}<br/>{a}:{c}' + dataCompany;
      dataList.series[0].data = Prices;

      dataList.series[0].markPoint.data[2].symbolSize =0;
      dataList.dataZoom = dataZoom;

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
      // 渲染图表
      var node = this.refs.chart.getDOMNode();
      var mychart = echarts.init(node);
      mychart.setOption(dataList);
    }
  },
  initChart: function() {
    var list = [];
    var Prices = [];
    if (_.isEmpty(this.props.data) ||  _.isEmpty(this.props.data[this.state.dataName])) {
      return;
    }
    // 一定要判断this.isMounted() 否则报错
    if (this.props.active=='active' && this.isMounted()) {
      var xData = this.props.data[this.state.dataName].data || this.props.data;
      var dataParse = format.chartFormat(xData,this.state.dataName);
      var xData = dataParse.data;
      var dataCompany = dataParse.dataCompany;
      for (var i = 0; i < xData.length; i++) {
        // x轴 上的时间
        list.push(parseInt(xData[i].date) || 0);
        // x轴上的数字
        Prices.push(parseFloat(xData[i].val)||0); //转换精度，否则计算错误
      }
      var dataList = this.state.option;
      dataList.yAxis[0].axisLabel.formatter = '{value}'+dataCompany;
      dataList.tooltip.formatter = '日期:{b}<br/>{a}:{c}' + dataCompany;
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
      var mychart = echarts.init(node);
      mychart.setOption(dataList);
    }
  },
  handleContrast:function(){
    var obj = {
      id:this.props.stockId,
      dataName:this.state.dataName,
      name:this.props.name,
      title:this.props.title,
      data:this.props.data,
    };
    // 通知顶级面板render
    this.props.handleContrast(obj);
  },
  openFull:function(){
    ModalSwitchActions.openModal();
    PopChartActions.setData({id:this.props.stockId,dataName:this.state.dataName});
  },
  render: function() {
    this.props.clazz=='chart-big'?this.initBigChart():this.initChart();
    var str = this.props.active==''?'panel-chat hide':'panel-chat ';
    return this.props.clazz=='chart-big'?
    (
          <div className={`${this.props.clazz} mb-50`} style={{width:940,height:400}} ref="chart"/>
    ):(
      <div className={str}>
        <div className="panel-head">
          <p className="panel-l-name">{this.props.name}</p>
          <p className="panel-l-title">{this.props.title}</p>
          <a className="panel-r-contrast" href="javascript:;" onClick={this.handleContrast}>对比</a>
        </div>
        <div className="panel-body">
          <div className={this.props.clazz} ref="chart"/>
          <a href="javascript:;" className="btn-full" onClick={this.openFull}>查看大图</a>
        </div>
      </div>
    );
  }
});

module.exports = EchartLine;
