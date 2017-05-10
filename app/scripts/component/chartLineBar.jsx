import React, {Component, PropTypes} from 'react';
import echarts from 'echarts/lib/echarts';
import chartTmpl from '../util/chartTmpl';
import _ from '_';
import Format from '../util/format.js';
import theme from 'echarts/theme/macarons';
const $ = require('jquery');
require('echarts/lib/chart/bar');

var UP_COLOR = '#f7654d',
    DOWN_COLOR = '#6ca575';

var DEFAULT_SERIES = [
    {
        name: '买卖收益',
        type: 'bar',
        barWidth: 15,
        itemStyle: {
            normal: {
                color: UP_COLOR,
                label: {
                    show: true,
                    position: 'right',
                    formatter: function (item) {
                        return item.value + '%';
                    }
                }
            }
        },
        data: []
    }
];



export default class ChartLineBar extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    data: []
  }
  state = {
    option: chartTmpl.ratioBar,
    stockDays:[],
    yAxisData:[],
    seriesData:[],
    DATA_MAP:{}
  }
  componentDidMount() {
    this.initChart();
  }
  initChart () {
    let {stocks,values} = this.props.data
    // 处理数据
    // var _values = values;
    var _values = _.reverse(values);
    let stockDays = [];
    let yAxisData = [];
    let seriesData = [];
    let DATA_MAP = {};
    for (var index = 0, item; item = _values[index]; index += 1) {
      var stock = stocks[item.stock_id] || item.stock_id,
      v = (item.earn_ratio * 100).toFixed(1) * 1;
      yAxisData.push(stock);
      // 盈利 or 亏损
      var isProfit = v >= 0;
      var o = {
        name: stock,
        value: v,
        build_date: item.build_date,
        days: item.days
      };
      if (!isProfit) {
        o.itemStyle = {
          color: DOWN_COLOR,
          normal: {
            color: DOWN_COLOR,
            label: {
              position: 'left'
            }
          }
        };
      }
      seriesData.push(o);

      stockDays.push({
        name: stock,
        code: item.stock_id.substr(0, 6),
        clear_date: item.clear_date,
        value: item.days
      });

      // key = 股票名称 + 加仓时间
      DATA_MAP[stock + item.build_date] = item;
    }
    this.setState({
      stockDays:stockDays,
      yAxisData:yAxisData,
      seriesData:seriesData,
      DATA_MAP:DATA_MAP
    },()=>{
      this.mergeData();
    });
  }
  mergeData() {
    let {DATA_MAP} = this.state;
    function tipFormatter(params) {
      var t = params[0],
          item = DATA_MAP[t.name + (t.data ? t.data.build_date : '')],
          tips = [];
      if (item) {
          tips = [
              t.name.replace(/\|/g,"<br/>"), '（', item.stock_id, '）', '<br/>',
              Format.stringDateFormat(item.build_date), ' - ', (item.clear_date > 0 ? Format.stringDateFormat(item.clear_date) : '至今'), '<br/>',
              '盈亏比例：', t.value, '%', '<br/>',
              '盈亏金额：', Format.addCommas(item.earn.toFixed(0))
          ];
      } else {
          tips = [t.name, '<br/>', '盈亏比例：', t.value, '%'];
      }
      return tips.join('');
    }

    let {option} = this.state;
    option.yAxis[0].data = this.state.yAxisData;
    // bar
    var series = $.extend(true, {}, DEFAULT_SERIES[0]);
    series.data = this.state.seriesData;
    option.series = [series];
    option.tooltip.formatter = tipFormatter;
    option.grid.height = this.state.stockDays.length*30;
    let node = this.refs.chart.getDOMNode();
    let mychart = echarts.init(node,theme);
    mychart.setOption(option);
  }
  componentWillReceiveProps(nextProps) {
      if (nextProps!=this.props) {
        this.initChart(nextProps);
      }
  }
  render () {
    let hei = this.state.stockDays.length*30;
    return(
      <div className='chart-ratio' ref="chart" style={{height:hei,marginTop:53}}/>
    );
  }
}
