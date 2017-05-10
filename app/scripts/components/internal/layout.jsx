"use strict"
import React ,{Component} from 'react';
import _ from '_';
const TableProgress = require('./tableProgress');
import InternalModal from '../../model/internalModal';
const Format = require('../../util/format');
import numeral from 'numeral';
import Loading from '../loading';
import If from '../If';
const moment = require('moment');


/* 增减持 */
const list1 = [
  '增减持时间',
  '类型',
  '',
  '金额(万)',
  '占股比',
  '成本',
  '',
  '对比计划完成度',
  '公告发布日'
];

/*员工持股计划*/
const list2 = [
  '时间',
  '',
  '',
  '金额(万)',
  '占股比',
  '成本',
  '',
  '完成度',
  '公告发布日',
];

/* 回购  */
const list3 = [
  '时间',
  '',
  '',
  '金额(万)',
  '占股比',
  '成本',
  '',
  '完成度',
  '公告发布日',
];

/* 员工激励 */
const list4 = [
  '公告发布日',
  '类型',
  '',
  '金额(万)',
  '占股比',
  '成本',
  '',
  '解锁业绩增速',
  ''
]

const keyMap = {
  2: '大股东增持',
  6: '大股东减持',
  4: '高管增持',
  7: '高管减持',
  3: '公司回购',
  0: '限制性股票激励',
  1: '股票期权激励',
  5: '员工持股计划'
};

const keyStatus = {
  1: '计划',
  2: '进展',
  3: '结束',
};

const colors = {
  1: 'row-greed',
  2: 'row-org',
  3: 'row-red',
};

const bgcolor = {
  0: '',
  1: '',
  2: 'row-red',
  6: 'row-greed',
  7: 'row-greed',
  3: 'row-red',
  4: 'row-red',
  5: 'row-red',
};

const _colors = {
  1: 'row-text-blue',
  2: 'row-text-org',
  3: 'row-text-greed',
};

const Layout = React.createClass({
  getInitialState: function() {
    return {
      loading: true,
      data: {},
      price: 10,/* 实时股价 */
      last_trade_price: 0,
      time: null
    }
  },

  componentDidMount: function() {
    let sid = this.props.params.sid;
    let time = setInterval(() => {
      this.getPrice(sid.toLowerCase());
    }, 3000);
    this.setState({time});
    this.getData(sid.toLowerCase());
  },

  componentWillReceiveProps: function(nextProps) {
    let sid = nextProps.params.sid || this.props.params.sid;
    this.getData(sid.toLowerCase());
  },

  componentWillUnmount: function() {
    clearInterval(this.state.time);
  },

  getData: function(sid) {
    InternalModal.getNewStockInfo(sid, result => {

      InternalModal.baselastPrice(sid, _result => {
        this.setState({
          price: _result.latest[sid],
          last_trade_price: _result.last_trade_price[sid],
          data: result,
        }, () => {
          this.setState({
            data: this.filterData(),
            loading: false,
          });
        });
      });

    });
  },

  getPrice: function(sid, cb) {
    InternalModal.baselastPrice(sid, result => {
      this.setState({
        price: result.latest[sid],
        last_trade_price: result.last_trade_price[sid],
      }, () => {
        this.filterData();
      });
    });
  },

  /* 过滤数据，使子组件可直接使用，省去模版内过滤 */
  filterData: function() {
    let {
      state: {
        price,
        data
      }
    } = this;

    data.incr_decr = this.filterIncrDecr(data.incr_decr, price, 'incr');
    data.motivation = this.filterIncrDecr(data.motivation, price, 'motivation');
    data.owner_plan = this.filterIncrDecr(data.owner_plan, price, 'owner_plan');
    data.buy_back = this.filterIncrDecr(data.buy_back, price, 'buy_back');
    return data;
  },

  /* 增减持 */
  filterIncrDecr: function(data, price, type) {
    for(let i = 0; i < data.length; i++) {
      data[i].parent_item.trade_start_date = data[i].parent_item.trade_start_date == 0 ?
                                             '' :
                                             moment(data[i].parent_item.trade_start_date).format('YYYY/MM/DD');
      data[i].parent_item.trade_end_date = data[i].parent_item.trade_end_date == 0?
                                           '':
                                           moment(data[i].parent_item.trade_end_date).format('YYYY/MM/DD');
      data[i].parent_item.timeFirst = data[i].parent_item.trade_start_date == data[i].parent_item.trade_end_date ?
                                      data[i].parent_item.trade_start_date :
                                      `${data[i].parent_item.trade_start_date}-${data[i].parent_item.trade_end_date}`;
      if (data[i].parent_item.status == 1) {
        data[i].parent_item.timeFirst = moment(data[i].parent_item.stockholders_meeting_date).format('YYYY/MM/DD');
      }
      if (type != 'motivation') {
        data[i].parent_item.icon = data[i].sub_item.length > 1 ? 'fa fa-plus' : '';
        data[i].parent_item.statusClass = bgcolor[data[i].parent_item.event_type];
        data[i].parent_item.typeClass = _colors[data[i].parent_item.status];
        data[i].parent_item.statusName = keyStatus[data[i].parent_item.status] || '';
      }
      data[i].parent_item.share_ratios = data[i].parent_item.share_ratio>0 ?
                                        numeral(data[i].parent_item.share_ratio).format('0.00%'):
                                        '-';
      if (data[i].parent_item.cost > 0 && data[i].parent_item.cost != '0.00') {
        data[i].parent_item.cost = numeral(data[i].parent_item.cost).format('0.00') || '-';
        /* 收益率在盘间需要实时跳动，计算公式为（实时股价-成本）/成本，收盘或者停牌日保留最近一个交易日收盘时结果 */
        data[i].parent_item.tr3 =  numeral((price - data[i].parent_item.cost) / data[i].parent_item.cost).format('0.0%');
        data[i].parent_item.tr3Class = (price - data[i].parent_item.cost) / data[i].parent_item.cost > 0 ? 'row-text-red' : 'row-text-greed';
      }
      else {
        data[i].parent_item.cost = '-';
        data[i].parent_item.tr3 = '-';
      }
      data[i].parent_item.timeLast = moment(data[i].parent_item.publish_date).format('YYYY/MM/DD');
      if (type == 'incr') {
        data[i].parent_item.tr1 = keyMap[data[i].parent_item.event_type];
        data[i].parent_item.tr2 = '';// data[i].parent_item.people_num;
      }
      if (type == 'buy_back' ) {
        data[i].parent_item.tr1 = '';// numeral(data[i].parent_item.buy_back_price).format('0.00');
      }
      if (type == 'motivation') {
        data[i].parent_item.tr1 = keyMap[data[i].parent_item.event_type];
        data[i].parent_item.timeFirst = data[i].parent_item.publish_date;
        data[i].parent_item.timeLast = '';
        data[i].parent_item.progress = data[i].parent_item.increase_ratio;
      }

      /*       fix #1092*/
      if (data[i].sub_item.length == 1) {
        data[i].sub_item = [];
        return data;
      }

      for(var j = 0; j < data[i].sub_item.length; j++) {

        if (data[i].sub_item[j].trade_start_date != 0 &&
            data[i].sub_item[j].trade_end_date != 0
        ) {
          if (data[i].sub_item[j].trade_start_date == data[i].sub_item[j].trade_end_date ) {
            data[i].sub_item[j].timeFirst =`${moment(data[i].sub_item[j].trade_start_date).format('YYYY/MM/DD')}`;
          }
          else {
            data[i].sub_item[j].timeFirst =`${moment(data[i].sub_item[j].trade_start_date).format('YYYY/MM/DD')}-${ moment(data[i].sub_item[j].trade_end_date).format('YYYY/MM/DD')}`;
          }
        }
        else {
          if (data[i].sub_item[j].trade_start_date != 0) {
            data[i].sub_item[j].timeFirst = moment(data[i].sub_item[j].trade_start_date).format('YYYY/MM/DD');
          }
          else {
            data[i].sub_item[j].timeFirst = moment(data[i].sub_item[j].trade_end_date).format('YYYY/MM/DD');
          }
        }

        data[i].sub_item[j].tr1 = keyMap[data[i].sub_item[j].event_type];
        if (type == "buy_back") {
          data[i].sub_item[j].tr1 ='';
        }
        if (type == "owner_plan") {
          data[i].sub_item[j].tr1 = '';
          data[i].sub_item[j].tr2 = '';
        }
        data[i].sub_item[j].tr2 = '';
        data[i].sub_item[j].share_ratios = data[i].sub_item[j].share_ratio>0 ?
                                          numeral(data[i].sub_item[j].share_ratio).format('0.00%'):
                                          '-';
        if (data[i].sub_item[j].cost > 0 && data[i].sub_item[j].cost  != '0.00') {
          data[i].sub_item[j].cost = numeral(data[i].sub_item[j].cost).format('0.00') || '-';
          /* 收益率在盘间需要实时跳动，计算公式为（实时股价-成本）/成本，收盘或者停牌日保留最近一个交易日收盘时结果 */
          data[i].sub_item[j].tr3 =  numeral((price - data[i].sub_item[j].cost) / data[i].sub_item[j].cost).format('0.0%');
          data[i].sub_item.tr3Class = (price - data[i].sub_item.cost) / data[i].sub_item.cost > 0 ? 'row-text-red' : 'row-text-greed';
        }
        else {
          data[i].sub_item[j].cost = '-';
          data[i].sub_item[j].tr3 = '-';
          data[i].sub_item[j].share_ratios = '-';
          data[i].sub_item[j].tr3Class = (price - data[i].sub_item[j].cost) / data[i].sub_item[j].cost > 0 ? 'row-text-red' : 'row-text-greed';
        }
        data[i].sub_item[j].timeLast = moment(data[i].sub_item[j].publish_date).format('YYYY/MM/DD');
      }
    }

    return data;
  },

  render: function() {
    let {
      state: {
        loading =  true,
        data = {},
        last_trade_price,
        price
      }
    } = this;

    return loading ? (
      <Loading />
    ): (
      <div className="container bn">
        <div className="panel-title">
          <h1 >
            <span className="fwb">
              {`${data.stock_name}(${data.stock_id.toLocaleUpperCase()})`}
            </span>
            <span className={
              (price-last_trade_price)/last_trade_price == 0 ?
                             'table-title-price-sm':(
                               (price-last_trade_price)/last_trade_price > 0?
                               'table-title-price-sm-red':
                               'table-title-price-sm-greed'
                             )
                            }>
              {price - last_trade_price > 0?'+':''}
              {numeral(price - last_trade_price).format('0.00')}
              ({(price - last_trade_price)/last_trade_price > 0?'+':''}
              { numeral((price - last_trade_price)/last_trade_price).format('0.00%') })
            </span>
            <span className="table-title-price-lg">
              {numeral(price).format('0.00')}&nbsp;
            </span>
          </h1>
        </div>
        <If when={data.incr_decr.length > 0}>
          <TableProgress
              ttitle = {'增减持'}
              thead = {list1}
              titem = {data.incr_decr}
              type={'incr_decr'}
          />
        </If>

        <If when={data.owner_plan.length > 0}>
          <TableProgress
              ttitle = {'员工持股计划'}
              thead = {list2}
              titem = {data.owner_plan}
              type={'owner_plan'}
          />
        </If>

        <If when={data.buy_back.length > 0}>
          <TableProgress
              ttitle = {'回购'}
              thead = {list3}
              titem = {data.buy_back}
              type={'buy_back'}
          />
        </If>

        <If when={data.motivation.length > 0}>
          <TableProgress
              ttitle = {'员工激励'}
              thead = {list4}
              titem = {data.motivation}
              type={'motivation'}
              sid ={this.props.params.sid}
          />
        </If>
      </div>
    );
  }
});

module.exports = Layout;
