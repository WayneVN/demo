/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "交易费用-大图"
 */


'use strict';
var React = require('react');
var moment = require('moment');
const {Modal} = require('react-bootstrap');
const _ = require('_');
var formatter = require('../../../util/format');
var numeral = require('numeral');
var TallyModal = require('../../../model/tallyModal').default;
const logger = require('../../../util/logger');
const echarts = require('echarts/lib/echarts');
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const $ = require('jquery');



const d = '#a0dcfb';
const z = '#5cc4fc';
const g = '#35a3ff';
const optionTmpl = {
  z: 3,
  animation: true,
  startAngle: 220,
  endAngle: -40,
  splitNumber: 1,
  radius: 150,
  center: ['50%', '50%'],
  axisLine: {
    lineStyle: {
      width: 30,
      color: [[0.35, d],[0.65, z],[1, g]],
    }
  },
  itemStyle: {
    normal: {
      color: '#58bce1'
    }
  },
  pointer: {
    show: true,
    color: 'red',
    width: 16,
    length: 100
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    length: 50,
    lineStyle: {
      color: 'auto'
    }
  },
  title: {
    textStyle: {
      fontWeight: 'bolder',
      fontSize: 20,
      fontStyle: 'italic'
    }
  },
  detail: {
    show: false
  },
  data: [{value: 50, name: ''}]
};

const CostChartModal = React.createClass({
  getInitialState() {
    return {
      option: this.props.option,
      from: this.props.from,
      to: this.props.to,
      annual_turnover_rate: this.props.annualTurnoverRate,
      counter_fee: this.props.counterFee,
      btnText: ''
    }
  },

  getDefaultProps() {
    return {
      option: {},
      annualTurnoverRate: 0,
      counterFee: 0
    };
  },

  componentDidMount() {
    logger.log({
      target: 'init_costChartModal'
    });

    this.initCalendar();
    this.renderChart();

  },

  initCalendar() {
    var me = this;
    var element = me.refs.date.getDOMNode();
    var fromDate = moment(this.props.beg.toString()).toDate();
    var now = moment().subtract(1, 'day').toDate();
    var times = {
      from: fromDate,
      to: now
    };

    $(element).daterangepicker({
      maxDuration: 3650,
      isShowDateRange: false,
      selectableDateRange: times,
      selectedRange: times,
    }).on('changeDate', event => {
      let dateArr = event.date.split('-');
      let beg =  moment(dateArr[0].replace(/\./g, ''));
      let end =  moment(dateArr[1].replace(/\./g, ''));
      let _from = beg.format('YYYYMMDD');
      let _to = end.format('YYYYMMDD');

      this.setState({
        from: beg.format('YYYY/MM/DD'),
        to: end.format('YYYY/MM/DD'),
      },() => {
        this.filterData();
      });
    });

    $(document).bind('click', this.clickHandler);
  },

  // 将所有数据迭代换算成可展示数据
  filterData() {
    let {
      state: {
        from,
        to
      }
    } = this;
    const {
      props: {
        oldData: list
      }
    } = this;
    let beg = _.sortedIndexBy(list, {
      'date': moment(from).format('YYYYMMDD')
    }, 'date');
    let end = _.sortedIndexBy(list, {
      'date': moment(to).format('YYYYMMDD')
    }, 'date');
    let arr = list.filter((item,i) => {
      return i>=beg && i<=end;
    });
    if (!arr || !arr.length) {
      this.setState({
        annual_turnover_rate: 0,
        counter_fee: 0,
      }, () => {
        this.renderChart();
      });
    }
    else {
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
      }, () => {
        this.renderChart();
      });
    }
  },

  renderChart() {
    let obj = _.cloneDeep(this.props.option);
    obj.series = _.remove(obj.series, o => o.name);
    obj.silent = false;
    optionTmpl.data[0].value = this.renderMax(this.state.annual_turnover_rate);
    this.setState({
      btnText: this.renderBtn(this.state.annual_turnover_rate)
    });

    $.extend(true, obj.series[0], optionTmpl);

    var node = this.refs.bigChart.getDOMNode();
    var mychart = echarts.init(node);
    mychart.setOption(obj);
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

  lastData() {
    let {
      state: {
        from,
        to
      }
    } = this;
    this.props.closeModal(from,to);
  },

  renderDom() {
    let {
      state: {
        from,
        to,
        annual_turnover_rate,
        counter_fee,
        btnText
      }
    } = this;

    return (
      <div className="bigChart-panel">
        <div className="bigChart-panel-head">
          <span className="bigChart-panel-title">累计换手率</span>
          <span className="bigChart-panel-num">
            {numeral(annual_turnover_rate).format('0%')}
          </span>
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
             onClick={()=>{this.lastData()}}
          />
        </div>
        <div className="bigChart-panel-body" >
          <span className="bigChart-top-text">
            {btnText}
          </span>
          <span className="bigChart-bottom-num">
            {numeral(counter_fee).format('0,0')}
          </span>
          <span className="bigChart-bottom-text">
            累计交易费用
          </span>
          <div ref="bigChart" style={{
            width: 920,
            height: 360,
          }}/>
        </div>
      </div>
    );
  },

  render() {
    return (
      <Modal show={true}
p             container={this}
             {...this.props}
             {...this.state}
             dialogClassName="chart-modal-lg"
             onHide ={this.lastData}
      >
        {this.renderDom()}
      </Modal>
    );
  }

});

module.exports = CostChartModal;
