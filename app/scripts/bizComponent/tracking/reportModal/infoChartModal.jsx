/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－个股详情"
 */

const React = require('react')
const Tooltip = require('rc-tooltip');
const {Modal} = require('react-bootstrap');
const TrackingModel = require('../../../model/trackingModel');
const numeral = require('numeral');
const echarts = require('echarts/lib/echarts');;
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const $ = require('jquery');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const logger = require('../../../util/logger');
var config = require('../report/config');

const InfoChartModal = React.createClass({

  getInitialState() {
    return {
      index: [],
      showValue: 0,
      selectValue: '1',
      max: 0,
      min: 0
    };
  },

  getDefaultProps() {
    return {
      list: []
    };
  },

  componentDidMount() {
    logger.log({
      target: 'init_infoChartModal'
    });
  },

  getAllData(arrList=[]) {
    if (!arrList.length) {
      return [];
    }
    let _list = [];
    arrList = _.reverse(_.sortBy(arrList, 'earn'));
    let maxVal = _.maxBy(arrList, 'earn');
    let minVal = _.minBy(arrList, 'earn');
    maxVal = maxVal.earn>Math.abs(minVal.earn)?maxVal:minVal;
    for(var i = 0; i < arrList.length; i++) {
      arrList[i]._progress = Math.abs(arrList[i].earn/maxVal.earn);
      _list.push(arrList[i]);
    }
    return _list;
  },

  renderDom() {
    let {
      state: {
        selectValue = 1
      }
    } = this;
    let bgData = this.props.list;
    var setting = this.props.setting;
    var rankType = setting.rank_type || config.rankType.value;

    if (parseInt(selectValue) == 1) {
      bgData = _.filter(this.props.list, o => o.earn>0);
    }
    else if (parseInt(selectValue) == -1) {
      bgData = _.filter(this.props.list, o => o.earn<0);
    }
    let dataMap = this.getAllData(bgData);

    return (
      <div className="bigmodal-table">
        <div className="bigmodal-table-head">
          <ul>
            <li>&nbsp;</li>
            <li>股票名称</li>
            
            <li>
              <If when={rankType == config.rankType.value}>
                <span>盈利金额</span>
              </If>
              <If when={rankType == config.rankType.ratio}>
                <span>盈利比例</span>
              </If>
            </li>
          </ul>
        </div>
        <div className="bigmodal-table-body">
          {
            dataMap.map((item, k) => {
              return <div className="bigmodal-table-tr" key={k}>
          <ul className="bigmodal-table-row">
            <li className="targer"></li>
            <li className="text-overflow">
              {item.stock_name}&nbsp;({item.stock_id.split(',')[0]})
            </li>
            <li>
              <div className="bigmodal-progress-warp">
                <div className={`progress-back${ item.earn>0 ?'':'-down' }`} style={{
                  width: numeral(item._progress).format('0%')
                }} />
              </div>
              <If when={rankType == config.rankType.value}>
                <span className="report-bar-progress">
                  {numeral(item.earn).format('0,0')}
                </span>
              </If>
              <If when={rankType == config.rankType.ratio}>
                <span className="report-bar-progress">
                  {numeral(item.ratio).format('0.00%')}
                </span>
              </If>
            </li>
          </ul>
          {/* <ul className="bigmodal-table-sub-row">
          <li></li>
          <li>高伟大(234220.sh)</li>
          <li>
          55%
          </li>
          <li>222,222</li>
          </ul> */}
              </div>
            })
          }
        </div>
      </div>
    );
  },

  changeSelct(event) {
    let {
      target: {
        value
      }
    } = event;
    this.setState({
      selectValue: value
    });
  },

  render() {
    let {
      state: {
        selectValue = '1',
        min,
        max
      }
    } = this;
    const {
      props: {
        list
      }
    } = this;

    let text = '';
    let sum = 0;
    switch(selectValue) {
      case '1':
        text = '盈利总计';
        sum = _.sumBy(_.filter(list, o => o.earn>0), 'earn');
        break;
      case '-1':
        text = '亏损总计';
        sum = _.sumBy(_.filter(list, o => o.earn<0), 'earn');
        break;
       default:
        text = '盈亏总计';
        sum = _.sumBy(list, 'earn');
        break;
    }

    return (
      <Modal show={true}
             container={this}
             {...this.props}
             {...this.state}
             dialogClassName="chart-modal-lg"
             onHide={() => {
                 this.props.closeModal()
               }}
      >
        <div className="bigChart-panel">
          <div className="bigChart-panel-head">
            <span className="bigChart-panel-title">{text}</span>
            <span className={sum>=0?'bigChart-panel-num-up':'bigChart-panel-num-down'}>
              {numeral(sum).format('0,0')}
            </span>
            <select className="report-daily-select" onChange={this.changeSelct}>
              <option value="1">个股盈利</option>
              <option value="-1">个股亏损</option>
              <option value="0">查看全部</option>
            </select>
            <i className="fa fa-remove"
             onClick={()=>{this.props.closeModal()}}
          />
          </div>
          <div className="bigChart-panel-body">
            {this.renderDom()}
          </div>
        </div>
      </Modal>
    );
  }

});

module.exports = InfoChartModal;
