"use strict";
/**
 * 右侧 筛选结果
 */
var React = require('react');
var Link = require('react-router').Link;
var ChartLine = require("../components/panel_chat_line");
var Listtag = require("../components/list_tag");


var RightContent = React.createClass({
  render: function() {
    return (
      <div className="panel-content">
        <div className="panel-head">
          <h2>联创电子作家22.2亿借壳亚麻产业(02312.32)</h2>
          <div className="icon-group">
            <small>所在行业:银行</small>
            <small>所在地:上海</small>
            <small>企业性质:私营企业</small>
          </div>
        </div>
        <div className="panel-body p20">
          <ul className="link-btn">
            <li className="item-btn">
              <button className="btn btn-active btn-default">并购重组</button>
            </li>
            <li className="item-info">
              <span className="color-org">123亿&nbsp;</span>收购上海信托
            </li>
            <li className="item-time">
              <small>2015-11-11</small>
            </li>
          </ul>
          {/*<ul className="link-btn">
            <li className="item-btn">
              <button className="btn btn-active btn-default">内部交易</button>
            </li>
            <li className="item-info">
              <span className="color-org">123亿&nbsp;</span>收购上海信托
            </li>
            <li className="item-time">
              <small>2015-11-11</small>
            </li>
          </ul>*/}
          <hr className="hr" />
          <Listtag isRow={true} />
          <ChartLine color={true} title="收盘价"/>
          <ChartLine color={false} title="还手率"/>
          <ChartLine color={true} title="市盈率"/>
          <ChartLine color={false} title="市精率"/>

        </div>
      </div>
    );
  }
});

module.exports = RightContent;
