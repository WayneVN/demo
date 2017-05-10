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
const tmpl = require('../../../util/chartTmpl');
import DailyBar from '../../../component/dailyBar';
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const DailyChartModal = require('../reportModal/dailyChartModal');
const Tooltip = require('rc-tooltip');

const style = {
  'day': {
    char:'日',
    action: 'days',
    clazz: 'mod-range'
  },
  'week': {
    char:'周',
    action: 'solt',
    clazz: 'mod-range hide',
  },
  'month': {
    char:'月',
    action: 'solt',
    clazz: 'mod-range hide',
  },
  'quarter': {
    char:'季',
    action: 'solt',
    clazz: 'mod-range hide',
  },
  'year': {
    char:'年',
    action: 'solt',
    clazz: 'mod-range hide',
  },
};

var Daily = React.createClass({

  getInitialState() {
    return {
      type: 'day',
      data: {},
      result: {},
      isLoading: true,
      isShow: false
    };
  },

  componentDidMount() {
    this.getData();
  },

  getData() {
    let {
      beg,
      end
    } = time.oneYear();
    let {
      state: {
        type,
      }
    } = this;

    TallyModal.getUserTotalIncome(type, beg, end, (result) => {
      this.setState({
        data: result.data,
        result: result,
        isLoading: false
      });
    });
  },

  renderLoading() {
    return (
      <div className="report-card-md mr10" style={{
        height: 280
      }}>
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  activeModal(params) {
    let _type = params?(params.type == 'click'? this.state.type: params.type || 'day'): 'day';

    this.setState({
      isShow: !this.state.isShow,
      type: _type
    },() => {
      this.getData();
    });
  },

  render() {
    let {
      state: {
        result,
        data: {
          values = []
        },
        type,
        isLoading,
        isShow
      }
    } = this;
    let {
      action,
      clazz
    } = style[type];
    let maxItem = 0;

    if (values.length) {
      let _maxItem = _.last(_.sortBy(values, [
        type == 'day' ?'day_earn':'earn'
      ]));
      maxItem = numeral(type == 'day' ? _maxItem.day_earn :_maxItem.earn ).format('0,0');
    }

    return isLoading?
           this.renderLoading() :
           (
             <div className="report-card-md mr10" style={{
               height: 280
             }}>

               <If when={isShow}>
                 <DailyChartModal
                     closeModal={this.activeModal}
                     data={result}
                     type={type}
                 />
               </If>

               <div className="report-card-head">
                 <span className="report-text">
                   单{style[type].char}盈利
                 </span>
                 <Tooltip placement="right" overlay={
                   <div className="tal">
                                   日盈亏 = 今日市值 - 昨日市值 <br/> <span style={{marginLeft: 50}}>-今日转入(现金,证券市   值) + 今日转出(现金,证券市值)</span>
                   </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-card-body" onClick={this.activeModal}>
                 <p className="report-body-title">
                   {maxItem}
                 </p>
                 <DailyBar data={result}
                           action={action}
                           type={type}
                           tmpl={tmpl}
                 />
               </div>
             </div>
           );
  },

});

module.exports = Daily;
