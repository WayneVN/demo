/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－当月收益率"
 */

const React = require('react');
const TrackingModel = require('../../../model/trackingModel');
const theme = require('echarts/theme/macarons');
const echarts = require('echarts/lib/echarts');;
const _ = require('_');
const zrColor = require('zrender/src/tool/color');
const moment = require('moment');
const numeral = require('numeral');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const LineChartModal = require('../reportModal/lineChartModal');
const SelectKey = require('../../../util/selectKey');
const ParseData = require('../parseData');
const Tooltip = require('rc-tooltip');
var config = require('./config');

require('echarts/lib/chart/line');
var img = require('../../../../images/circle.png');
const YCOLOR = '#bcbcbc';
const YLINECOLOR = '';
const XCOLOR = '#bcbcbc';

var _TEXTKEY = `${ SelectKey[0].indexname }`;

const SERIESTMPL = {
  name: 'ab',
  type: 'line',
  symbol: 'none',
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#4EEE94',
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
      let line2 = `${ _TEXTKEY }: ${ numeral(o[1].data).format('0.0%') }` ;
      return `${ _time } <br/> ${ line1 } <br/> ${ line2 }`;
    }
  },
  legend: {
    show: false,
    data: ['收益率', '对比指数','ab']
  },
  toolbox: {
    show: false,
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    scale: true,
    data: ['1'],
    nameGap: 10,
    axisTick: {
      show: true,
    },
    axisLine: {
      lineStyle: {
        width: 1,
        color: XCOLOR
      }
    },
    axisLabel: {
      textStyle: {
        color: XCOLOR
      },
      formatter: function(value,o,a,b) {
        return value? moment(value.toString()).format('YYYY/MM/DD'): '';
      }
    },
  }],
  yAxis: [{
    splitLine: {
      interval: 6
    },
    scale: true,
    type: 'value',
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
    splitNumber: 2,
    axisLabel: {
      textStyle: {
        color: YCOLOR
      },
      interval: 4,
      formatter: function(value) {
        return `${ numeral(value).format('0%') }\n`;
      }
    },
  }],
  grid: {
    top: 20,
    bottom: 0,
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
          width: 1.5,
          color: '#284a7d'
        }
      },
    },
    data: [0]
  }, {
    name: '对比指数',
    type: 'line',
    symbol: 'none',//`image://${ img }`,
    smooth: true,
    data: [],
    zlevel: 3,
    symbolSize: 8,
    hoverAnimation: false,
    itemStyle: {
      normal: {
        lineStyle: {
          width: 1.5,
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
      dataList: [], //指数
      userData: [], //用户收益率
      lastProfit: 1,
      company: '',
      companyYear: '',
      isLoading: true,
      record_first_day: '',
      text: SelectKey[0].indexname,
      isShow: false,

      setting: this.props.setting || {}
    }
  },

  componentDidMount() {
    this.getOwnData();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps, () => {
      if (this.state.dataList.length) {
        this.parseData();
      }
    });
  },

  getOwnData() {
    TrackingModel.getUserProfit( result => {
      if (result.status) {
        let userList = ParseData.initUserData(result.data, result.prev_trade_date);
        this.setState({
          userData: userList,
        }, () => {
          this.getData();
        });
      }
    });
  },

  getData() {
    let {
      state: {
        code
      }
    } = this;
    TrackingModel.getRecordinfo(result => {
      if (result.status) {
        this.setState({
          record_first_day: result.record.record_first_day
        }, () => {
          const beg = this.state.record_first_day.toString();
          const end = moment().format('YYYYMMDD');

          TrackingModel.getClosePrices(code, ParseData.prev_trade_date, end, (result) => {
            let datalist =  ParseData.initIndexData(result.data);
            this.setState({
              dataList: datalist,
              isLoading: false
            }, () => {
              this.parseData();
            });
          });

        });
      }
    });

  },

  parseData() {
    let {
      state: {
        dataList ,
        userData,
        setting
      }
    } = this;
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
    this.setState({
      lastProfit: _.last(option.series[0].data) || 0
    }, () => {
      this.renderChart();
    });
  },

  renderChart() {
    const elm = this.refs.chart.getDOMNode();
    if (!this._chart) {
      this._chart = echarts.init(elm, theme);
    }
    this._chart.setOption(option, true);
  },

  // 改变时间区间
  changeRadio(e) {
    let {
      target: {
        value: radioValue
      }
    } = e;

    this.setState({
      radioValue
    }, () => {
      this.parseData();
    });
  },

  _onChangeType(e) {
    let {
      target: {
        value: code
      }
    } = e;

    this.setState({
      code
    }, () => {
      this.getData();
    });

  },

  activeModal(text) {
    _TEXTKEY= text;
    this.setState({
      isShow: !this.state.isShow,
      dataList: ParseData.getParseData('index'),
      userData: ParseData.getParseData('user'),
      text: text
    }, () => {
      this.parseData();
    });
  },

  renderLoading() {
    return (
      <div className="report-card-md mr10 mb10 clearfix" >
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  render() {
    let {
      state: {
        radioValue,
        company,
        companyYear,
        lastProfit,
        record_first_day,
        isLoading,
        isShow,
        text,
        dataList, //指数
        userData, //用户收益率
        setting
      }
    } = this;

    let tipText = ``;
    var calculateType = +setting.cal_type || config.calType.average;

    return isLoading?
           this.renderLoading() :
           (
             <div className="report-card-md mr10 mb10 clearfix" >
               <If when={isShow}>
                 <LineChartModal
                     isShow={isShow}
                     chartData={{
                       dataList: dataList,
                       userData: userData,
                     }}
                     text={_TEXTKEY}
                     beg={ record_first_day || '20100101'}
                     closeModal={this.activeModal}
                     setting={setting}
                 />
               </If>
               <div className="report-card-head">
                 <span className="report-text">
                   净值收益
                 </span>
                 
                 <Tooltip placement="right" overlay={
                  <div>
                    <If when={calculateType == config.calType.total}>
                    <div className="tal">
                      区间收益率: P(1+Xi) - 1(函数P()表示下标从0到i的连乘);<br/>
                      例:设20160510为基准点，X20160511=1%、<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;X20160512=2%、X20160513=1.5%;<br/>
                      则收益率S20160513=(1+1%)(1+2%)(1+1.5%)-1<br/>
                      指数收益率 = 每日指数值 / 基准日指数值 - 1<br/>
                      (取选择起点的前一个交易日为基准点)
                    </div>
                    </If>

                    <If when={calculateType == config.calType.average}>
                    <div className="tal">
                      平均收益率(当前日期)=累计盈亏(区间内) / 日平均投入资本(区间内)<br/>
                      累计盈亏(区间内) = (净资产(当前时间)- 累计投入资本(当前时间))<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp; - (净资产(起始时间) - 累计投入资本(起始时间))<br/>
                      日平均投入资本(区间内) = sum(累计投入资本) / 天数<br/>
                      （可参考Modified Dietz method  <a target="_blank" href="https:\/\/en.wikipedia.org/wiki/Modified_Dietz_method">https:\/\/en.wikipedia.org/wiki/Modified_Dietz_method</a> ）
                    </div>
                    </If>
                  </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-card-body" onClick={this.activeModal}>
                 <p className="report-body-title">
                   {numeral(lastProfit).format('0.0%')}
                 </p>
                 <div ref="chart" style={{
                                      width: 468,
                                      height: 160,
                                      }}/>
               </div>

             </div>
           );
  }

});

module.exports = LineChart;
