/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账-报告-每日盈亏"
 */

'use strict';
var React = require('react');
const numeral = require('numeral');
const time = require('../../../util/getTime');
const TallyModal = require('../../../model/tallyModal').default;
import DailyBar from '../../../component/dailyBar';
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const {Modal} = require('react-bootstrap');
const _ = require('_');
const $ = require('jquery');
const moment = require('moment');
const tmpl = require('../../../util/chartTmpl');
const format = require('../../../util/format')
const dateFmt = format.stringDateFormat;
const echarts = require('echarts/lib/echarts');
const logger = require('../../../util/logger');


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

const KEYMAPS = {
  day: '日',
  week: '周',
  month: '月',
  quarter: '季',
  year: '年',
}

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

var DailyChartModal = React.createClass({

  getInitialState() {
    var tpl = _.cloneDeep(tmpl.dailyBar);
    tpl.grid.bottom = 80;
    tpl.grid.bottom = 80;
    tpl.yAxis[0].axisLabel.textStyle.fontSize = 16;
    tpl.yAxis[0].axisTick.textStyle.length = 45;
    tpl.xAxis.minInterval = 0;
    return {
      data: {},
      result: {},
      isLoading: true,
      from: null,
      to: null,
      start: this.props.start || 0,
      end: this.props.end || 100,
      xAxisData: null,
      seriesData: null,
      min: null,
      max: null,
      chartObj: null,
      chartOption: tpl,
      type: this.props.type,
      intercept: null, //截取数据，需要返回
    };
  },

  getDefaultProps() {
    return {
      isShow: false,
      chartData: {},
    };
  },

  componentDidMount() {
    logger.log({
      target: 'init_dailyChartModal'
    });
    this.updateData();
  },

  initCalendar() {
    let element = this.refs.date.getDOMNode();
    let fromDate = new moment('2011-01-01').toDate();
    let now = new Date();
    let {
      state: {
        result,
        from,
        to
      }
    } = this;
    let begSelect = moment(result.data.values[0].date.toString()).toDate();
    let endSelect = moment(result.data.values[result.data.values.length-1].date.toString()).toDate();
    $(element).daterangepicker({
      /* 可选范围*/
      selectableDateRange: {
        from: from? moment(from.toString()).toDate(): begSelect,
        to:  to?moment(to.toString()).toDate():endSelect,
      },
      /* 选中*/
      selectedRange: {
        from: from?moment(from.toString()).toDate(): moment('2016-1-13').toDate(),
        to:  to?moment(to.toString()).toDate(): moment('2016-1-15').toDate()
        /* from: moment('2016-1-13').toDate(),
         * to: moment('2016-1-12').toDate(),*/
      }
    }).on('changeDate', event => {
      let dateArr = event.date.split('-');

      this.setState({
        from: moment(dateArr[0].replace(/\./g, '')).format('YYYY/MM/DD'),
        to: moment(dateArr[1].replace(/\./g, '')).format('YYYY/MM/DD')
      }, () => {
        this.updateZoom();
      });
    });
  },

  initChart() {
    let {
      type,
      xAxisData,
      seriesData,
      min,
      max,
      chart,
      chartOption,
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
    if (type == 'days' || type=='day') { // 盈亏金额
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

  },

  generateOption() {
    var option = this.state.chartOption;
    option.xAxis[0].data = this.state.xAxisData;
    option.series = [];

    _.each(this.state.seriesData, (data, i) => {
      var s = $.extend(true, {}, DEFAULT_SERIES[i]);
      s.data = data;
      if (s.markPoint && data.length > 1) {
        if (this.state.max.value >= 0) {
          max.name = '最大盈利';
        } else {
          max.name = '最小亏损';
          max.itemStyle = DOWN_ITEM_STYLE;
        }

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

    let node = this.refs.bigChart.getDOMNode();
    let mychart = echarts.init(node);
    this.onDatazoom(mychart);

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
    }

    this.setState({
      chartObj: mychart,
      chartOption: option
    }, () => {
      this.state.chartObj.setOption(option);
    });
  },

  _onChangeType(e) {
    let obj = this.state.chartOption;
    obj.dataZoom.start = 0;
    obj.dataZoom.end = 100;
    this.setState({
      type: e.target.value,
      start: 0,
      end: 100,
      chartOption: obj
    }, () => {
      tmpl.dailyBar.dataZoom[1].start = 0;
      tmpl.dailyBar.dataZoom[1].end = 100;
      this.updateData();
    });
  },

  updateData() {
    let {
      state: {
        type, from, to
      }
    } = this;

    TallyModal.getUserTotalIncome(type, from, to, (result) => {
      this.setState({
        raw: result.data,
        result: result,
        intercept: result.data.values
      }, () => {
        this.initChart();
      });
    });
  },

  onDatazoom(echartsInstance) {
    echartsInstance.on('datazoom', event => {
      tmpl.dailyBar.dataZoom[0].start = event.start;
      tmpl.dailyBar.dataZoom[0].end = event.end;
      this.setState({
        start: event.start,
        end: event.end
      });
    });
  },


  // 保存最后一次操作数据
  lastData() {
    let {
      state: {
        chartOption,
        start,
        end,
        type,
        result
      }
    } = this;
    let params = {
      zoomStart: start==0?this.props.start:start,
      zoomEnd: end==100?this.props.end: end,
      type: type,
    };
    tmpl.dailyBar.dataZoom[0].start = start
    tmpl.dailyBar.dataZoom[0].end = end;

    this.props.closeModal(params);
  },

  renderDom() {
    if (!this.state.raw) {
      return (
        <div></div>
      );
    }
    let {
      state: {
        from,
        to,
        type,
        raw: {
          values = false
        }
      }
    } = this;

    let maxItem = 0;
    if (values.length) {
      let _maxItem = _.last(_.sortBy(values, [
        type == 'day' ?'day_earn':'earn'
      ]));
      maxItem = numeral(type == 'day' ? _maxItem.day_earn :_maxItem.earn ).format('0,0');
    }

    return (
      <div className="bigChart-panel">
        <div className="bigChart-panel-head">
          <span className="bigChart-panel-title">最高单{KEYMAPS[type||'day']}盈利</span>
          <span className="bigChart-panel-num">{maxItem}</span>
          <select defaultValue={type || 'day'} className="report-daily-select"  onChange={this._onChangeType}>
            <option value="day" >按日</option>
            <option value="week">按周</option>
            <option value="month">按月</option>
            <option value="quarter">按季</option>
            <option value="year">按年</option>
          </select>
          <i className="fa fa-remove"
             onClick={this.lastData}
          />
        </div>
        <div className="bigChart-panel-body">
          <div ref="bigChart" style={{
            width: 920,
            height: 410,
          }}/>
        </div>
      </div>
    );
  },

  render() {
    const {
      props: {
        isShow = false
      }
    } = this;

    return (
      <Modal show={true}
             container={this}
             {...this.props}
             {...this.state}
             dialogClassName="chart-modal-lg"
             onHide ={this.lastData}
      >
        {this.renderDom()}
      </Modal>
    );
  },

});

module.exports = DailyChartModal;
