import React, {Component} from 'react';
const echarts = require('echarts/lib/echarts');;
const tmpl = require('../util/chartTmpl');
const theme = require('echarts/theme/macarons');
const format = require('../util/format')
const dateFmt = format.stringDateFormat;
const numeral = require('numeral');
const _ = require('_');
const $ = require('jquery');
require('echarts/lib/chart/bar');

var UP_COLOR = '#f7654d',
  DOWN_COLOR = '#6ca575',
  UP_ITEM_STYLE = {
    normal: {
      color: UP_COLOR
    }
  },
  DOWN_ITEM_STYLE = {
    normal: {
      color: DOWN_COLOR
    }
  },
  MAX_MARK_POINT = {
    name: '最大盈利',
    type: 'max',
    symbol: 'circle'
  },
  MIN_MARK_POINT = {
    name: '最大亏损',
    symbol: 'circle',
    symbolSize: function(v) {
      return Math.abs(v).toString().length * 4;
    }
  };

// 数据模板
var DEFAULT_SERIES = [
  {
    name: '盈亏金额',
    type: 'bar',
    itemStyle: {
      // '#01b1fb'
      normal: {
        color: UP_COLOR
      }
    },
    markPoint: {
      data: []
    },
    data: []
  }, {
    name: '无杠杆盈亏',
    type: 'bar',
    itemStyle: {
      normal: {
        color: '#c9c9c9'
      }
    },
    data: []
  }
];

export default class DailyBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: this.props.data.data,
      action: this.props.action,
      xAxisData: null,
      seriesData: null,
      min: null,
      max: null,
      chart: null,
      chartObj: null,
      chartOption: tmpl.dailyBar,
      type:this.props.type
    }
  };

  componentDidMount () {
    this._initChart();
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      raw:nextProps.data.data,
    },()=>{
      this._initChart();
    });
  }
  _initChart() {
    let {
      action,
      xAxisData,
      seriesData,
      min,
      max,
      chart,
      chartOption,
      raw
    } = this.state;
    if (!raw) {return;}
    var fndayTypeFormatter = function (dayType, date) {
        switch (dayType) {
            case 'year':
                return date + '年';

            case 'quarter':
                return (date + '').replace(/(\d{4})(\d{1})/, "$1年$2季");

            case 'month':
                return (date + '').replace(/(\d{4})(\d{2})/, "$1年$2月");

            case 'week':
                return dateFmt(date);
        }

        return date;
    };
    min = {
      date: '',
      value: null
    };
    max = {
      date: '',
      value: null
    };

    var keys, fmt;
    if (this.props.action === 'days') { // 盈亏金额
      keys = ['day_earn', 'no_leverage_day_earn'];
      fmt = dateFmt;
    } else { // 时间窗口
      keys = ['earn', 'no_leverage_earn'];
      fmt = _.partial(fndayTypeFormatter, raw.day_type);
    }
    var _xAxisData = [],
      _seriesData = [
        [], []
      ];
    // 解析数据
    var values = raw.values;
    for (var index = 0, item; item = values[index]; index += 1) {
      var date = fmt(item.date);
      _xAxisData.push(date);
      var earn = item[keys[0]].toFixed(0) * 1; // 盈亏金额
      if (earn >= 0) {
        _seriesData[0].push(earn);
      } else {
        _seriesData[0].push({name: date, value: earn, itemStyle: DOWN_ITEM_STYLE});
      }
      // 起点赋值
      if (index == 0) {
        // 最大值
        max.date = date;
        max.value = earn;
        // 最小值
        min.date = date;
        min.value = earn;
      } else {
        // 最大值
        if (earn > max.value) {
          max.date = date;
          max.value = earn;
        }
        // 最小值
        if (earn < min.value) {
          min.date = date;
          min.value = earn;
        }
      }
      _seriesData[1].push(item[keys[1]].toFixed(0) * 1); // 无杠杆盈亏
    }
    this.setState({
      xAxisData:_xAxisData,
      seriesData:_seriesData,
      max:max,
      min:min
    },()=>{
      this.generateOption();
    });

  }
  // 构造图形数据
  generateOption() {
      var option = this.state.chartOption;
      option.xAxis[0].data = this.state.xAxisData;
      option.series = [];

      _.each(this.state.seriesData, (data, i) =>{
          // es6中的object.assign无法做深度合并，所以用jquery.extend的递归合并
          var s = $.extend(true, {}, DEFAULT_SERIES[i]);
          s.data = data;
          if (s.markPoint && data.length > 1) {
              var max = $.extend(true, {}, MAX_MARK_POINT);
              if (this.state.max.value >= 0) {
                  max.name = '最大盈利';
              } else {
                  max.name = '最小亏损';
                  max.itemStyle = DOWN_ITEM_STYLE;
              }
              s.markPoint.data.push(max);

              var min = $.extend(true, {}, MIN_MARK_POINT);

              if (this.state.min.value >= 0) {
                  min.name = '最小盈利';
                  min.type = 'min';
              } else {
                  min.name = '最大亏损';
                  min.xAxis = this.state.min.date;
                  min.yAxis = min.value = this.state.min.value;
                  min.itemStyle = DOWN_ITEM_STYLE;
              }
              s.markPoint.data.push(min);
          }
          option.series.push(s);
      });
      let node = this.refs.chart.getDOMNode();
      let mychart = echarts.init(node, theme);

      this.setState({chartObj:mychart},()=>{
          this.state.chartObj.setOption(option);
      });
  }
  render () {
    return(
      <div className='chart-daily' ref="chart"></div>
    );
  }
}
