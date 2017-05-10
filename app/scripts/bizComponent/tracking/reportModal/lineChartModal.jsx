/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－当月收益率"
 */

const React = require('react');
const TrackingModel = require('../../../model/trackingModel');
const {Modal} = require('react-bootstrap');
const theme = require('echarts/theme/macarons');
const echarts = require('echarts/lib/echarts');;
const _ = require('_');
const $ = require('jquery');
const zrColor = require('zrender/src/tool/color');
const moment = require('moment');
const numeral = require('numeral');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const SelectKey = require('../../../util/selectKey');
require('echarts/lib/chart/line');
var img = require('../../../../images/circle.png');
const ParseData = require('../parseData');
const logger = require('../../../util/logger');
var config = require('../report/config');

const YCOLOR = '#bcbcbc';
const YLINECOLOR = '';
const XCOLOR = '#bcbcbc';

var TEXTKEY = `${ SelectKey[0].indexname }`;

const indexCache = {};

const SERIESTMPL = {
  name: 'ab',
  type: 'line',
  symbol: 'none',
  itemStyle: {
    normal: {
      lineStyle: {
        width: 1
      }
    },
    emphasis: {
      label: {
        show: false
      }
    }
  },
  data: [0]
};

const option = {
  tooltip: {
    trigger: 'axis',
    formatter: function(o,a,b) {
      let _time = moment(o[0].name.toString()).format('YYYY/MM/DD') ;
      let line1 = `${ o[0].seriesName }: ${ o[0].data == '-' ? 'NA' : numeral(o[0].data).format('0.0%') }` ;
      let line2 = `${ TEXTKEY }: ${ numeral(o[1].data).format('0.0%') }` ;
      return `${ _time } <br/> ${ line1 } <br/> ${ line2 }`;
    }
  },
  legend: {
    show: true,
    data: [
      {
        name: '收益率',
        icon: 'image://http://onb7pfrdl.bkt.clouddn.com/2.png'
      },
      {
        name: '上证指数',
        icon: 'image://http://onb7pfrdl.bkt.clouddn.com/1.png'
      }
    ],
    textStyle: {
      fontSize: 16
    },
    x: 'center',
    borderColor: 'red'
    
  },
  dataZoom: {
    show: false,
  },
  toolbox: {
    show: false,
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    scale: true,
    nameGap: 20,
    axisTick: true,
    axisLine: {
      lineStyle: {
        width: 1,
        color: XCOLOR
      }
    },
    axisLabel: {
      textStyle: {
        color: XCOLOR,
        fontSize: 14,
      },
      formatter: function(value,o,a,b) {
        return value? moment(value.toString()).format('YYYY/MM/DD'): '';
      }
    },
  }],
  yAxis: [{
    scale: true,
    type: 'value',
    splitLine: {
      interval: 6
    },
    splitNumber: 2,
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
    axisLabel: {
      interval: 6,
      textStyle: {
        color: YCOLOR,
        fontSize: 16,
      },
      formatter: function(value) {
        return `${ numeral(value).format('0%') }\n\n`;
      }
    },
  }],
  grid: {
    top: 90,
    bottom: 20,
    left: 20,
    right: 20,
    containLabel: true
  },
  series: [{
    name: '收益率',
    type: 'line',
    symbol: 'none',
    smooth: true,
    itemStyle: {
      normal: {
        lineStyle: {
          width: 2,
          color: '#284a7d'
        }
      },
    },
    data: [0]
  }, {
    name: '上证指数',
    type: 'line',
    symbol: 'none',
    smooth: true,
    data: [],
    zlevel: 3,
    symbolSize: 8,
    hoverAnimation: false,
    itemStyle: {
      normal: {
        lineStyle: {
          width: 2,
          color: '#a0dcfb'
        }
      }
    }
  },]
};

const LineChart = React.createClass({
  _chart: '',

  getInitialState() {
    return {
      type: 'user', // user || index
      code: SelectKey[0].indexid,
      isLoading: true,
      from: null,
      lastProfit: 1,
      to: null,
      start: 0,
      end: 100,
      chartData: {
        dataList: [],
        userData: []
      }
    }
  },

  getDefaultProps() {
    return {
      isShow: false,
      chartData: {},
    };
  },

  componentDidMount() {
    logger.log({
      target: 'init_lineChartModal'
    });
    this.setState({
      chartData: this.props.chartData
    }, () => {
      this.initCalendar();
      let {
        state: {
          chartData: {
            dataList,
            userData
          }
        }
      } = this;
      this.parseData(dataList,userData);
    });
  },

  componentWillUnmount() {
    $(document).unbind('click', this.clickHandler);
  },

  initCalendar() {
    var me = this;
    var element = me.refs.date.getDOMNode();
    var fromDate = moment(this.props.beg.toString()).toDate();
    var now = moment().subtract(1, 'day').toDate();

    $(element).daterangepicker({
      maxDuration: 3650,
      isShowDateRange: false,
      selectableDateRange: {
        from: fromDate,
        to: now
      },
      selectedRange: {
        from: fromDate,//moment().month(0).date(1).toDate(),
        to: now
      }
    }).on('changeDate', event => {
      let dateArr = event.date.split('-');
      let beg =  moment(dateArr[0].replace(/\./g, ''));
      let end =  moment(dateArr[1].replace(/\./g, ''));
      let _from = beg.format('YYYYMMDD');
      let _to = end.format('YYYYMMDD');
      let userData = ParseData._parseUser(_from, _to);
      let indexData = ParseData._parseIndex(_from, _to);
      let obj = {
        dataList: indexData,
        userData: userData
      };

      this.setState({
        from: beg.format('YYYY/MM/DD'),
        to: end.format('YYYY/MM/DD'),
        chartData: obj
      },() => {
        this.parseData(
          this.state.chartData.dataList,
          this.state.chartData.userData
        )
      });
    });

    $(document).bind('click', this.clickHandler);
  },

  getData(text) {
    let {
      state: {
        code
      }
    } = this;
    const beg = '20010101';
    const end = moment().format('YYYYMMDD');
    let list = this.props.chartData.userData;
    let firstDate = list[0].date;
    let lastDate = list[list.length-1].date;
    option.legend.data[1].name=text;
    option.series[1].name = text;
    

    if (!indexCache[code]) {
      TrackingModel.getClosePrices(code, beg, end, (result) => {
        indexCache[code] = ParseData.setIndexData(result.data);
        let indexList = ParseData._parseIndex(
          this.state.from || firstDate, //这两段时间不处理，很容易鬼畜
          this.state.to || lastDate
        );
        let userList = ParseData._parseUser(
          this.state.from || firstDate,
          this.state.to || lastDate
        );
        let obj = {
          dataList: indexList,
          userData: userList
        };

        this.setState({
          chartData: obj
        }, () => {
          this.parseData(
            this.state.chartData.dataList,
            this.state.chartData.userData
          );
        });
      });
    }
    else {
      ParseData.setIndexData(indexCache[code]);
      let indexList = ParseData._parseIndex(
        this.state.from || firstDate,
        this.state.to || lastDate
      );
      let userList = ParseData._parseUser(
        this.state.from || firstDate,
        this.state.to || lastDate
      );
      let obj = {
        dataList: indexList,
        userData: userList
      };
      this.setState({
        chartData: obj
      }, () => {
        this.parseData(
          this.state.chartData.dataList,
          this.state.chartData.userData
        );
      });
    }


  },

  changeDataZoom(dateArr) {
    let {
      state: {
        radioValue,
        chartData: {
          dataList = {},
          userData = {}
        }
      }
    } = this;

    let data = option.xAxis[0].data;
    let begTime = parseInt(dateArr[0].replace(/\./g, ''));
    let endTime = parseInt(dateArr[1].replace(/\./g, ''));

    let beg = _.sortedIndex(data, begTime);
    let end = _.sortedIndex(data, endTime);
    option.dataZoom[0].start = beg/data.length*100;
    option.dataZoom[0].end = end/data.length*100;
    this.renderChart();
  },

  parseData(dataList, userData) {
    var setting = this.props.setting || {};

    var calculateType = +setting.cal_type || config.calType.average;
    option.series[1].data = dataList.map(o => {
      return o.val;
    });
    option.xAxis[0].data = dataList.map(o => o.date);

    if (calculateType == config.calType.total) {
      option.series[0].data = userData.map(o => {
        return o.val;
      });
    }
    else if (calculateType == config.calType.average) {
      var net_value_begin = userData[0].net_value;
      var total_vested_capital_begin = userData[0].total_vested_capital;
      var totalMoney = 0;

      option.series[0].data = userData.map((item, index) => {
        // 计算公式: 累计盈亏(区间内) / 日平均投入资本(区间内)
        //   累计盈亏(区间) = (净资产.end - 累计投入资本.end) - (净资产.begin - 累计投入资本.begin)
        //   日平均投入资本(区间) = sum(累计投入资本) / 天数
        var income = (item.net_value - item.total_vested_capital) 
          - (net_value_begin - total_vested_capital_begin);
        totalMoney += item.total_vested_capital > 0 ? item.total_vested_capital : 0;
        var averageMoney = totalMoney / (index + 1);

        return averageMoney > 0 ? (income / averageMoney).toFixed(5) : '-';
      });
    }

    var param = {
      lastProfit: _.last(option.series[0].data) || 0
    };
    var xAxisData = option.xAxis[0].data;

    if (!this.state.from) {
      param.from = moment(xAxisData[0] + '').format('YYYY/MM/DD');
      param.to = moment(xAxisData[xAxisData.length - 1] + '').format('YYYY/MM/DD');

      let elm = this.refs.date.getDOMNode();
      $(elm).data('DateRangePicker').update({
        startTime: moment(xAxisData[0] + '').toDate(),
        endTime: moment(xAxisData[xAxisData.length - 1] + '').toDate()
      });
    }

    this.setState(param, () => {
      this.renderChart();
    });
  },

  clickHandler(event) {
    let { target } = event;

    if (!($(target).hasClass('selected-date')
       || $(target).parents('.date-panel').length)
    ) {
      $('.date-panel').hide();
      $('.selected-date').removeClass('opened');
    }
  },

  renderChart() {
    const elm = this.refs.bigChart.getDOMNode();
    if (!this._chart) {
      this._chart = echarts.init(elm);
    }
    this._chart.setOption(option, true);
  },

  onDatazoom(echartsInstance) {
    echartsInstance.off('datazoom');
    echartsInstance.on('datazoom', event => {
      let data = option.xAxis[0].data;
      let _start = event.start!=0?data.length *(event.start/100):0;
      let _end = event.end!=100? data.length *(event.end/100):data.length-1;
      let obj = {
        startTime: moment(data[parseInt(_start)].toString()).toDate(),
        endTime: moment(data[parseInt(_end)].toString()).toDate(),
      };
      let elm = this.refs.date.getDOMNode();
      $(elm).data('DateRangePicker').update(obj);
      this.setState({
        from: moment(data[parseInt(_start)].toString()).format('YYYY/MM/DD'),
        to: moment(data[parseInt(_end)].toString()).format('YYYY/MM/DD'),
      });
    });
  },

  _onChangeType(e) {
    let {
      target: {
        value: code
      }
    } = e;

    let obj = _.find(SelectKey, {'indexid': code});
    TEXTKEY = `${ obj.indexname }`;
    this.setState({
      code
    }, () => {
      this.getData(TEXTKEY);
    });

  },

  renderLoading() {
    return (
      <div className="report-card-md clearfix" style={{
        width: 480
      }}>
        <Loading />
      </div>
    );
  },

  renderDom() {
    let {
      state: {
        from,
        to,
        chartData,
        lastProfit
      }
    } = this;
    let selectid =  _.find(SelectKey,{'indexname': TEXTKEY}).indexid || '';
    return (
      <div className="bigChart-panel">
        <div className="bigChart-panel-head">
          <span className="bigChart-panel-title">净值收益</span>
          <span className="bigChart-panel-num">
            {numeral(lastProfit).format('0.0%')}
          </span>
          <select className="report-daily-select flr"
                  onChange={this._onChangeType}
                  defaultValue={selectid}

          >
            {
              SelectKey.map((item, key) => {
                return (
                  <option value={item.indexid} >
                  {item.indexname}
                  </option>
                )
              })
            }
          </select>
          <div eventKey='date' className="date-item current flr mr10" ref="date">
            {!from?
             "选择日期":
             <span>
               <span>
                 <i className="fa fa-calendar" />
                 &nbsp;
                 {from}
                 &nbsp;
               </span>
               <span>
                 <i className="fa fa-calendar" />
                 &nbsp;
                 {to}
               </span>
             </span>
             }
          </div>

          <i className="fa fa-remove"
             onClick={()=>{this.props.closeModal(TEXTKEY)}}
          />
        </div>
        <div className="bigChart-panel-body">
          
          <div ref="bigChart" style={{
            width: 920,
            height: 380,
            marginTop: -30
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
      <Modal show={isShow}
             container={this}
             {...this.props}
             {...this.state}
             dialogClassName="chart-modal-lg"
             onHide={() => {
                 this.props.closeModal(TEXTKEY)
               }}
      >
        {this.renderDom()}
      </Modal>
    );
  }

});

module.exports = LineChart;
