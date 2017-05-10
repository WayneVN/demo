/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－交易费用"
 */

const React = require('react');
var moment = require('moment');
const Gauge = require('../../../component/gauge');
const _ = require('_');
const zrColor = require('zrender/src/tool/color');
var echarts = require('echarts/lib/echarts');;
const TrackingModel = require('../../../model/trackingModel');
const numeral = require('numeral');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const CostChartModal = require('../reportModal/costChartModal');
const Tooltip = require('rc-tooltip');
const d = '#a0dcfb';
const z = '#5cc4fc';
const g = '#35a3ff';


const option = {
  silent: true,
  series: [
    {
      name: '',
      axisLine: {
        lineStyle: {
          color: [[0.35, d],[0.65, z],[1, g]],
          width: 55,
        }
      },
      axisLabel: {
        show: false,
        distance: 20,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        length: 0
      },
      pointer: {
        show: true,
        width: 8,
        length: '70%',
      },
      itemStyle: {
        normal: {
          color: '#fff',
          shadowColor: 'rgba(255, 255, 255, 0.9)',
          shadowBlur: 15
        }
      },
      type: 'gauge',
      center: ['50%', '90%'],
      radius: 70,
      startAngle: 180,
      endAngle: 0,
      detail: {
        show: false,
      },
      data: [{value: 50, name: ''}]
    },
    {
      animation: false,
      name: 'background',
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      pointer: {
        width: 0
      },
      axisTick: {
        length: 10,
        lineStyle: {
          color: '#b2b5b4'
        }
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        length: 10
      },
      axisLine: {
        lineStyle: {
          color: [[0.3,'#ebebeb'],[0.8,'#ebebeb'],[1,'#ebebeb']],
          width: 10,
        }
      },
      center: ['50%', '90%'],
      radius: 85,
      data: [{value: 0, name: ''}]
    }]

};

const CostChart = React.createClass({
  getInitialState() {
    return {
      annual_turnover_rate: 0, //年化换手率
      counter_fee: 0, //累计手续费
      record_first_day: null,
      oldData: [],
      from: '20000101',
      to: '20201230',
      result: {
        btn: '',
        range: 0,
        max: 20,
        btnStyle: {},
        isLoading: true
      }
    }
  },

  getRecordTime() {
    TrackingModel.getRecordinfo(result => {
      this.setState({
        record_first_day: result.record.record_first_day
      });
    });
  },

  getData() {
    TrackingModel.getTurnoverRate(result => {
      if (result.status) {
        this.setState({
          oldData: result.data //原始数据
        }, () => {
          this.filterData(result.data);
        });
      }
    });
  },

  // 将所有数据迭代换算成可展示数据
  filterData(arr) {
    if (arguments.length>1) {
      let beg = _.sortedIndexBy(arr, {
        'date': moment(arguments[1]).format('YYYYMMDD')
      }, 'date');
      let end = _.sortedIndexBy(arr, {
        'date': moment(arguments[2]).format('YYYYMMDD')
      }, 'date');
       arr = arr.filter((item,i) => {
        return i>=beg && i<=end;
      });
    }

    /* 累计交易费用(区间): sum(每日交易费用)
     * 换手率年化值: 日均换手率 * 244(一年交易日数量)
     * 日均换手率(区间): 日平均买入股票市值/日平均净资产
     * 日平均买入股票市值(区间): sum(每日买入市值) / 交易日天数
     * 日平均净资产(区间): sum(每日日净资产) / 交易日天数*/

    let counter_fee = _.sumBy(arr, 'counter_fee'); // 累计交易费用 ***
    let a = _.sumBy(arr, 'bought_value')/arr.length;   // 日平均买入股票市值
    let b = _.sumBy(arr, 'net_value')/arr.length // 日平均净资产
    let c = (a/b).toFixed(5); // 日均换手率
    let d = c * 244; // 换手率年化值 ***

    this.setState({
      annual_turnover_rate: d,
      counter_fee: counter_fee,
      isLoading: false
    }, () => {
      this.parseData();
    });

  },

  parseData() {
    let {
      state: {
        annual_turnover_rate: val
      }
    } = this;
    let range = this.renderMax(val);
    option.series[0].data[0].value = range;

    this.setState({
      btn: this.renderBtn(val),
      range: range
    }, () => {
      this.renderChart();
    });
  },

  renderChart() {
    const element = this.refs.chart.getDOMNode();
    let _chart = echarts.init(element);
    _chart.setOption(option, true);
  },

  componentDidMount() {
    this.getData();
    this.getRecordTime();
  },

  renderBtn(val) {
    if (val > 10) {
      return '高频';
    }
    if (val < 10 && val > 5) {
      return '中频';
    }
    if (val < 5) {
      return '低频';
    }
  },

  renderMax(val) {
    if (0 <= val && val <= 5) {
      return (val / 5) * 33;
    }
    if (5 <= val && val <= 10) {
      var tmp = val - 5;
      return 33 + (tmp/5)*33;
    }
    if ( 10 < val && val < 30) {
      var tmp = val - 10;
      return 66 + (tmp / 20) * 16;
    }
    var tmp = val - 30;
    return 82 + (tmp / 70) * 16;
  },

  renderLoading() {
    return (
      <div className="report-card-lg-md" >
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  activeModal(from = this.state.from,to = this.state.to) {
    this.setState({
      isShow: !this.state.isShow,
      from: from,
      to: to
    }, () => {
      this.filterData(this.state.oldData, from, to);
    });
  },

  render() {
    let {
      state: {
        max,
        isShow,
        btn: btnText,
        btnStyle,
        isLoading,
        range,
        counter_fee,
        annual_turnover_rate,
        record_first_day,
        oldData
      }
    } = this;

    return isLoading?
           this.renderLoading() :
           (
             <div className="report-card-lg-md" >
               <If when={isShow}>
                 <CostChartModal
                     closeModal={this.activeModal}
                     option={option}
                     range={range}
                     btnText ={btnText}
                     counterFee = {counter_fee}
                     annualTurnoverRate = {annual_turnover_rate}
                     beg = {record_first_day}
                     oldData = {oldData}
                 />
               </If>
               <div className="report-card-head">
                 <span className="report-text">
                   年化换手率
                 </span>
                 <Tooltip placement="right" overlay={
                   <div className="tal">
                                                     年化换手率 = 日均换手率 * 244(一年交易日数量)
                                                     <br/>日均换手率 = 日平均买入股票市值/日平均市值
                   </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-card-body" onClick={() => {this.activeModal()}}>
                 <p className="report-body-title">
                   {numeral(annual_turnover_rate).format('0%')}
                 </p>
                 <div className="report-chart-sm" ref="chart" style={{height: 100}} />
                 <div className="report-border-bottom" />
                 <div className="chart-round-bg" />
                 <p className="cost-detail-text">
                   累计交易费用&nbsp;
                   <span className="cost-num">
                     {numeral(counter_fee).format('0,0')}&nbsp;
                   </span>
                 </p>
                 <div className="cost-tool">
                   <div className="cost-tool-btn">
                     <span className="btn-block"
                           style={{
                             background: d
                           }}
                     ></span>
                     低频
                   </div>
                   <div className="cost-tool-btn">
                     <span className="btn-block"
                           style={{
                             background: z
                           }}
                     ></span>
                     中频
                   </div>
                   <div className="cost-tool-btn">
                     <span className="btn-block"
                           style={{
                             background: g
                           }}
                     ></span>
                     高频
                   </div>
                 </div>
               </div>
             </div>
           );
  }

});

module.exports = CostChart;
