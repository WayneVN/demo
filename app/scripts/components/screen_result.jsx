"use strict";
/**
 * 个股筛选－结果面板
 */

var React = require('react');
var Reflux = require('reflux');
var _ = require('_');
var Link = require('react-router').Link;
var Pager = require('react-pager');
var Table = require('./table');
var FilterResultAction  = require('../actions/FilterResultAction');
var FilterResultStore = require('../stores/FilterResultStore');
var FilterResultAction = require('../actions/FilterResultAction');
var FilterActions = require('../actions/FilterActions');

var ScreenResult = React.createClass({
  mixins: [
    Reflux
      .connectFilter(FilterResultStore, 'data', function(datalist) {
        var list  = datalist.data;
        var _total = parseInt(datalist.total/10) + (datalist.total%10 ==0 ? 0 :1);
        this.setState({total:_total,current:datalist.page_num -1});
        if (_.isEmpty(list)) {
          return {};
        }
        var sortData = [];
        for (var i = 0; i < list.length; i++) {
          var obj = {
            stock_id: list[i].stock_id,
            stock_name: list[i].stock_name,
            stock_price: list[i].stock_price,
            market_value: list[i].market_value,
            pe: list[i].pe,
            pb: list[i].pb,
            revenue: list[i].revenue,
            year_growth: list[i].year_growth,
            season_growth: list[i].season_growth
          };
          sortData.push(obj);
        }
        return sortData;
      })
  ],
  getInitialState: function() {
    return {
      head: [
        {
          name: '股票代码',
          sortKey: 'stock_id'
        }, {
          name: '股票名称',
          sortKey: 'stock_name'
        }, {
          name: '股价',
          sortKey: 'stock_price'
        }, {
          name: '市值',
          sortKey: 'market_value'
        }, {
          name: '市盈率',
          sortKey: 'pe'
        }, {
          name: '市净率',
          sortKey: 'pb'
        }, {
          name: '营业收入',
          sortKey: 'revenue'
        }, {
          name: '年增速',
          sortKey: 'year_growth'
        }, {
          name: '当季增速',
          sortKey: 'season_growth'
        }
      ],
      data: [],
      total: 10,
      current: 1,
      visiblePage: 5
    };
  },
  componentDidMount: function() {
      FilterResultAction.getData();
  },
  handlePageChanged: function ( newPage ) {
       this.setState({ current : newPage });
       FilterActions.setPageNum(parseInt(newPage)+1);
       FilterActions.sortKey();
  },
  render: function() {
    return (
      <div className="panel fadeIn animated">
        <div className="panel-head">
          <p>筛选结果</p>
        </div>
        <div className="panel-body">
          <Table data={this.state.data} isLink={true} thead={this.state.head}/>
          <div className="custom_pagination">
                <Pager total={this.state.total}
                       current={this.state.current}
                       titles={{
                               first:   '首页',
                               prev:    '上一页',
                               prevSet: '<<',
                               nextSet: '>>',
                               next:    '下一页',
                               last:    '尾页'
                           }}
                       visiblePages={this.state.visiblePage}
                       onPageChanged={this.handlePageChanged}/>
           </div>
        </div>
      </div>
    );
  }
});

module.exports = ScreenResult;
