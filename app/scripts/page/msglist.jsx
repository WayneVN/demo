"use strict";
/**
 * 消息神器 筛选结果
 */
var React = require('react');
var Link = require('react-router').Link;
var Tab = require('../components/tab-lg');
var LeftSelect =require('../components/left_select');
var LeftResult = require('../components/left_result');
var RightContent = require('../components/right_content');

var MsgList = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="panel-left">
          <Tab />
          <LeftSelect />
          <LeftResult />
        </div>
        <div className="panel-right">
          <RightContent />
        </div>
      </div>
    );
  }
});

module.exports = MsgList;
