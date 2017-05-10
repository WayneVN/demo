import React, {
  Component
} from 'react';
const echarts = require('echarts/lib/echarts');;
const tmpl = require('../util/chartTmpl');
const theme = require('echarts/theme/macarons');
const format = require('../util/format')
const dateFmt = format.stringDateFormat;
const numeral = require('numeral');
const _ = require('_');
const $ = require('jquery');
require('echarts/lib/chart/bar');

let MAXVALUE = 0;
let MINVALUE = 0;
const UP_COLOR = '#FA5C5C';
const DOWN_COLOR = '#65cd6b';
const UP_ITEM_STYLE = {
  normal: {
    color: UP_COLOR,
  }
};
const DOWN_ITEM_STYLE = {
  normal: {
    color: DOWN_COLOR,
  }
};
const MAX_MARK_POINT = {
};
const MIN_MARK_POINT = {
};

// 数据模板
var DEFAULT_SERIES = [{
  name: '盈亏金额',
  type: 'bar',
  itemStyle: {
    normal: {
      color: UP_COLOR,
      label: {
        show: true,
        position: 'top',
        textStyle: {
          fontSize: 14,
          baseline: 'middle'
        },
        formatter: function(o) {
          if (o.value == MAXVALUE.value || o.value == MINVALUE.value) {
            return o.value?numeral(o.value).format('0,0'): '';
          }
          return '';
        }
      }
    }
  },
  data: []
}, {
  name: '无杠杆盈亏',
  type: 'bar',
  itemStyle: {
    normal: {
      color: '#c9c9c9',
      label: {
        show: true,
        position: 'outer',
      }
    }
  },
  data: []
}];

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
      type: this.props.type
    }
  };

  componentDidMount() {
    this._initChart();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      raw: nextProps.data.data,
    }, () => {
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
        raw
      } = this.state;
      if (!raw) {
        return;
      }
      var fndayTypeFormatter = function(dayType, date) {
        switch (dayType) {
          case 'year':
            return date + '年';

          case 'quarter':
            return (date + '')
              .replace(/(\d{4})(\d{1})/, "$1年$2季");

          case 'month':
            return (date + '')
              .replace(/(\d{4})(\d{2})/, "$1年$2月");

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
          [],
          []
        ];
      // 解析数据
      var values = raw.values;
      for (var index = 0, item; item = values[index]; index += 1) {
        var date = fmt(item.date);
        _xAxisData.push(date);
        var earn = item[keys[0]].toFixed(0) * 1; // 盈亏金额
        if (earn >= 0) {
          _seriesData[0].push({
            name: date,
            value: earn,
          });
        } else {
          _seriesData[0].push({
            name: date,
            value: earn,
            itemStyle: DOWN_ITEM_STYLE
          });
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
    MAXVALUE = max;
    MINVALUE = min;
      this.setState({
        xAxisData: _xAxisData,
        seriesData: _seriesData,
        max: max,
        min: min
      }, () => {
        this.generateOption();
      });

    }
  // 构造图形数据
  generateOption() {
    var option = this.props.tmpl.dailyBar;
    option.xAxis[0].data = this.state.xAxisData;
    option.series = [];

    _.each(this.state.seriesData, (data, i) => {
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
        /* s.markPoint.data.push(max);*/

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
      }
      option.series.push(s);
    });

    let node = this.refs.chart.getDOMNode();
    let mychart = echarts.init(node, theme);

    if (option.series.length) {
      let _index = _.findLastIndex(option.series[0].data, o => {
        return (o.value || o) == MINVALUE.value;
      });
      if (option.series[0].data[_index].value <= 0) {
        option.series[0].data[_index].itemStyle = {
          normal: {
            color: DOWN_COLOR,
            label: {
              show: true,
              position: 'bottom',
              formatter: function(o) {
                return numeral(o.value).format('0,0');
              }
            }
          }
        }
      }
      let list = [];
      const len = option.series[0].data.length;
      /* 图表x 坐标标签平分出4段，防止标签文字溢出容器 */
      for(var i = 1; i <= 8; i++) {
        if (i%2 == 1) {
          list.push(Math.ceil(len/8*i));
        }
      }
    }

    this.setState({
      chartObj: mychart
    }, () => {
      this.state.chartObj.setOption(option);
    });
  }

  render() {
    return (
      <div className='chart-sm' ref="chart" style={{
        width: 468,
        height: 180,
        marginRight: 'auto',
        marginLeft: 'auto'
      }} />
    );
  }
}
