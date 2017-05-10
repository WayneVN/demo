/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "资产曲线"
 */


'use strict';
var React = require('react');
var moment = require('moment');
var formatter = require('../../../util/format');
var numeral = require('numeral');
var _ = require('_');
var TallyModal = require('../../../model/tallyModal').default;
var dateFmt = formatter.stringDateFormat;
const logger = require('../../../util/logger');
const echarts = require('echarts/lib/echarts');
import ChartSumBar from '../../../component/chartSumBar';
const zrColor = require('zrender/src/tool/color');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const PropertyChartModal = require('../reportModal/propertyChartModal');
const Tooltip = require('rc-tooltip');


const YCOLOR = '#bcbcbc';
const XCOLOR = '#bcbcbc';
// 数据模板
const DEFAULT_SERIES = [{
  name: '',
  type: 'line',
  symbolSize: 4,
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#c9c9c9',
        width: 0
      }
    },
    emphasis: {}
  },
  data: []
}, {
  name: '市值',
  type: 'line',
  symbol: 'none',
  symbolSize: 5,
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#fe7800',
        width: 2
      }
    }
  },
  data: []
}, {
  name: '投入资本',
  type: 'line',
  symbol: 'none',
  symbolSize: 5,
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#a0dcfb',
        width: 2,
      }
    }
  },
  data: []
}];

// 图形数据
var CHART_OPTION = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    show: false,
  },
  grid: {
    top: 20,
    bottom: 0,
    left: 20,
    right: 20,
    containLabel: true
  },
  dataZoom: {
    show: true,
    realtime: true,
    start: 0,
    end: 100,
    height: 16,
    y: 195,
  },
  xAxis: [{
    type: 'category',
    axisLabel: {
      textStyle: {
        color: XCOLOR
      },
      formatter: function(value,o,a,b) {
        return value? moment(value.toString()).format('YYYY/MM/DD'): '';
      }
    },
    axisLine: {
      lineStyle: {
        width: 1,
        color: XCOLOR
      }
    },
    data: []
  }],
  yAxis: [{
    scale: true,
    axisTick: {
      show: true,
      length: 25,
      textStyle: {
        color: XCOLOR
      },
      lineStyle: {
        color: YCOLOR
      }
    },
    axisLine: {
      show: false
    },
    splitNumber: 4,
    axisLabel: {
      textStyle: {
        color: YCOLOR,
      },
      formatter: function(value) {
        /* if (!value && value!) {
         *   return value;
         * }*/
        if (value >= (1000 * 1000) ) {
          return `${ numeral(value).format('0.0a').toUpperCase() }\n`;
        }
        return `${ numeral(value).format('0a').toUpperCase() }\n`;
      }
    },
    boundaryGap: [0, 0.3]
  }],
  series: [
  ]
};

const PropertyChart = React.createClass({
  getInitialState() {
    this.raw = null;
    this.rawInvest = null;
    this.max = 0;
    this.min = 0;
    this.range = 10;
    this.block = 0;
    this.action = 'value-all'; // values / value-all
    this.chart = null;
    this.chartOption = CHART_OPTION;
    this.baseUrl = '';

    return ({
      isData: false,
      lastItem: 0,
      isShow: false,
      isLoading: true,
      start: 0,
      end: 100
    });
  },

  componentDidMount() {
    this._load();
  },

  _load() {
    this.setState({
      isData: true
    }, () => {
      TallyModal.getUserInvestments(result2 => {
        let {
          data: data2 = null
        } = result2;

        if (data2 && data2.values && data2.values.length) {
          this.setState({
            lastItem: data2.properties[data2.properties.length-1],
            isLoading: false
          },() => {
            this.raw = data2;
            this.rawInvest = data2;
            this.parse();
          });
        }
      });
    });
  },

  getQuery() {
    return {
      all: 1
    };
  },

  // 投入成本字典
  getInvestments() {
    var map = {};
    if (this.rawInvest && this.rawInvest.values && this.rawInvest.values.length) {
      var vs = this.rawInvest.values;
      for (var i = 0, item; item = vs[i]; i += 1) {
        map[item.date] = item.total;
      }
    }
    return map;
  },

  // 获取资产数据，针对投入成本需要做一些特殊处理
  getValues() {
    if (this.rawInvest.properties && this.rawInvest.properties.length) {
      var properties = this.rawInvest.properties,
        values = this.raw.values,
        all = values.concat(properties);
      // 滤重
      var map = {};
      for (var i = 0, item; item = all[i]; i += 1) {
        map[item.date] = item;
      }
      // 排序：小 -> 大
      var copy = _.values(map).sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
      return copy;
    }
    else {
      return this.raw.values;
    }
  },

  parse() {
    if (!this.raw) {
      return;
    }
    var hasInvest = !!this.rawInvest;
    // 投入成本
    var investments = hasInvest ? this.getInvestments() : {},
      preInvest = hasInvest ? (this.rawInvest.before && this.rawInvest.before
        .total || '-') : '-';
    // 数据结构
    var xAxisData = [],
      seriesData = [
        [],
        [],
        []
      ],
      values = this.getValues();
    // 解析数据
    for (var index = 0, item; item = values[index]; index += 1) {
      xAxisData.push(dateFmt(item.date));
      // 总资产 = 净资产 + 负债（现金 + 股票市值）
      var all = (item.net_value + item.debt_sum)
        .toFixed(0) * 1;
      seriesData[0].push(all); // 总资产
      seriesData[1].push(item.net_value.toFixed(0) * 1); // 净资产
      this.max = Math.max(all, this.max);
      this.min = Math.min(all, this.min);
      if (hasInvest === false) {
        continue;
      }
      // 投入资本
      var invest = investments[item.date];
      if (invest) {
        preInvest = invest; // 更新前者
      } else { // 用前者补位
        invest = preInvest
      }
      // 有数字和 - 两种情况
      seriesData[2].push(isNaN(invest) ? invest : invest.toFixed(0) * 1);
    }

    this.chartOption.xAxis[0].data = xAxisData;
    this.chartOption.series = [];
    // 构造图形数据
    _.each(seriesData, (data, i) => {
      if (data.length === 0) {
        return;
      }
      if (i!=0) {
        var series = DEFAULT_SERIES[i];
        series.data = data;
        this.chartOption.series.push(series);
      }
    });
    this.block = Math.ceil(this.max / this.range);
    let _max = _.max(this.chartOption.series[0].data);

    /* this.chartOption.series[0].itemStyle.normal.label = {
     *   show: true,
     *   formatter: (o) => {
     *     return o.value == _max?o.value: '';
     *   }
     * };*/
    this.parseChart();
  },

  parseChart() {
    var node = this.refs.chart.getDOMNode();
    var mychart = echarts.init(node);
    mychart.setOption(this.chartOption);
  },

  renderLoading() {
    return (
      <div className="report-card-lg" style={{
        height: 280
      }} >
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  activeModal(params) {
    let _start = params? params.start: this.state.start;
    let _end = params? params.end: this.state.end;
    this.setState({
      isShow: !this.state.isShow,
      start: _start,
      end: _end,
    },() => {
      this.chartOption.dataZoom.start = _start;
      this.chartOption.dataZoom.end = _end;
      CHART_OPTION.dataZoom.end = _end;
      CHART_OPTION.dataZoom.start = _start;
      this.parseChart();
    });
  },

  render() {
    let {
      state: {
        lastItem: {
          net_value = 0
        },
        isLoading,
        isShow,
        start,
        end
      }
    } = this;
    let NetValue = numeral(net_value).format('0,0');
    return isLoading?
           this.renderLoading() :
           (
             <div className="report-card-lg" style={{
               height: 280
             }} >
               <If when={isShow}>
                 <PropertyChartModal
                     closeModal={this.activeModal}
                     option={this.chartOption}
                     start={start}
                     end={end}
                     value = {NetValue}
                 />
               </If>
               <div className="report-card-head">
                 <span className="report-text">
                   当前市值
                 </span>
                 <Tooltip placement="right" overlay={
                   <div className="tal">
                                                     累计投入资本(截止当日) = sum(转入现金,转入证券市值) -  sum(转出现金,转出证券市值)
                                                     <br/>市值 = 现金 + 股票市值 + 基金市值 + 债券市值 - 负债
                   </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-card-body" onClick={()=>{this.activeModal()}}>
                 <p className="report-body-title">
                   {NetValue}
                 </p>
                 <div ref="chart" style={{
                   width: 478,
                   height: 180,
                 }}/>
               </div>
             </div>
           );
  },

});

module.exports = PropertyChart;
