"use strict";
/**
 * 左侧按钮选择面板-内部交易
 */
var React = require('react');
var Link = require('react-router').Link;
const Reflux = require('reflux');
const InternalTabStore = require('../stores/InternalTabStore');
const InternalTabActions = require('../actions/InternalTabActions');
const CheckStore = require('../stores/CheckStore');
const CheckActions = require('../actions/CheckActions');
var CheckPanel = require('./check_panel');
var InternalActions = require('../actions/InternalActions');
var _ = require('_');

var InsiderLeftSelect = React.createClass({
  getInitialState: function() {
    return {
      reset: false,
      checkCache: []
    };
  },
  componentWillMount: function() {},
  handleChange: function(val) {
    this.setState({values: val});
  },
  // 按钮点击后的callback
  returnVal: function(checkList, dataName) {
    let {checkCache:item} = this.state;
    let isPush = true;
    for (var i = 0; i <item.length ; i++) {
      if (item[i].key == dataName) {
        item[i] = {key:dataName,val:checkList};
        isPush = false;
      }
    }
    if (isPush) {
      item.push({key:dataName,val:checkList});
    }
    InternalTabActions.setSelect(item);
  },
  render: function() {
    return (
      <div className="panel-sm">
        <div className="panel-head">
          <p>筛选条件</p>
          <a className="link-res" href="/#/msg/internal">重新筛选</a>
        </div>
        <div className="panel-body">
          <CheckPanel name="时间" dataName="after" checkItem={['全部', '一周内', '一月内', '一季内', '一年内']} returnVal={this.returnVal}/>
          <CheckPanel name="交易类型" dataName="event_type" checkItem={['全部', '大股东增持/公司回购', '高管增持', '员工激励', '减持']} returnVal={this.returnVal}/>
          <CheckPanel name="板块" dataName="board" checkItem={['全部', '沪深主版', '中小板', '创业板']} returnVal={this.returnVal}/>
          <CheckPanel name="重大程度" dataName="is_vip" type="radio" checkItem={['全部', '重大']} returnVal={this.returnVal}/>
        </div>
      </div>
    );
  }
});

module.exports = InsiderLeftSelect;
