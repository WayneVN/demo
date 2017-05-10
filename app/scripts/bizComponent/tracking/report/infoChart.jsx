/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－个股详情"
 */

const React = require('react')
const Tooltip = require('rc-tooltip');
const TrackingModel = require('../../../model/trackingModel');
const numeral = require('numeral');
const echarts = require('echarts/lib/echarts');;
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const $ = require('jquery');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const InfoChartModal = require('../reportModal/infoChartModal');
var config = require('./config');

const InfoChart = React.createClass({

  getInitialState() {
    return {
      list: [],
      active: false,
      isShow: false,
      isLoading: true,
      setting: this.props.setting
    };
  },

  componentDidMount() {
    this.getData();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps);
  },

  getData() {
    TrackingModel.getUserIncomeSums(result => {
      if (!result.data) return ;
      let {
        data: {
          values = []
        }
      } = result;
      this.setState({
        list: values,
        isLoading: false
      });
    });
  },

  renderList(item, k) {
    var setting = this.state.setting;
    var rankType = setting.rank_type || config.rankType.value;

    return (
      <div className="report-bar-row" key={k}>
        <ul className="report-bar-name fll">
          <li className="text-overflow">
            {item.stock_name}
            ({item.stock_id.split('.')[0]})
          </li>
          <li className="report-bar-warp">
            <div className="report-bar-bor fll">
              <span className={`report-bar fll report-bar-${ item.earn>0? 'red': 'greed' }-bg`}
                  style={{
                    width: 220 * item._progress
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
      </div>
    )
  },

  getTop(arrList=[], intTop) {
    var setting = this.state.setting;
    var rankType = setting.rank_type || config.rankType.value;
    if (!arrList.length) {
      return [];
    }
    let _list = [];
    arrList = _.reverse(_.sortBy(arrList, 'earn'));
    let maxVal = _.maxBy(arrList, 'earn');
    let minVal = _.minBy(arrList, 'earn');
    maxVal = maxVal.earn>Math.abs(minVal.earn)?maxVal:minVal;
    if (rankType == config.rankType.value) {
      let maxVal = _.maxBy(arrList, 'earn');
      let minVal = _.minBy(arrList, 'earn');
      maxVal = maxVal.earn>Math.abs(minVal.earn)?maxVal:minVal;
      for(var i = 0; i < intTop; i++) {
        if (arrList.length > i) {
          //  取sum，求平均;  正值的sum 为 所有正数的总和
          arrList[i]._progress = Math.abs(arrList[i].earn/maxVal.earn);
          _list.push(arrList[i]);
        }
      }
    }
    else if (rankType == config.rankType.ratio) {
      var grain = 0;
      var lose = 0;

      _.forEach(arrList, (item) => {
        if (item.earn > 0) {
          grain += item.earn;
        }
        else {
          lose += item.earn;
        }
      });

      _.forEach(arrList, (item) => {
        if (item.earn >= 0) {
          item.ratio = item.earn / grain;
        }
        else {
          item.ratio = item.earn / lose;
        }
      });

      for (var i = 0; i < intTop && i < arrList.length; i++) {
        arrList[i]._progress = Math.abs(arrList[i].earn / maxVal.earn);
        
        _list.push(arrList[i]);
      }
    }
    
    return _list;
  },

  renderLoading() {
    return (
      <div className="report-card-lg por" >
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  activeModal() {
    this.setState({isShow: !this.state.isShow});
  },

  render() {
    let {
      state: {
        list = [],
        isLoading,
        isShow,
        setting
      }
    } = this;
    let _list = this.getTop(list, 6);
    let _tipList = this.getTop(list, 10);
    var rankType = setting.rank_type || config.rankType.value;

    return isLoading?
           this.renderLoading() :
           (
             <div className="report-card-lg por" >
               <If when={isShow}>
                 <InfoChartModal
                     closeModal={this.activeModal}
                     list={list}
                     setting={setting}
                 />
               </If>
               <div className="report-card-head">
                 <span className="report-text">
                   个股盈利
                 </span>
                 <Tooltip placement="right" overlay={
                   <div className="tal">
            个股盈亏 = 当前持有市值 + 现金分红 + sum(卖出市值,转出市值) - sum(买入市值,转入市值)
                   </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-bar-row-table" onClick={this.activeModal}>
                 <ul className="report-bar-row-head">
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
                 {
                   _list.map((item, k) => this.renderList(item, k))
                 }
               </div>

             </div>
           );
  }
});

module.exports = InfoChart;
