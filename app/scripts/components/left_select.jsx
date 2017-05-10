"use strict";
/**
 * 左侧按钮选择面板
 */
var React = require('react');
var Link = require('react-router').Link;
var CheckPanelk = require('./check_panel');


var LeftSelect = React.createClass({
  render: function() {
    return (
      <div className="panel-sm">
        <div className="panel-head">
          <p>筛选条件</p>
          <a href="javascript:;" className="link-res">重新筛选</a>
        </div>
        <div className="panel-body">

          <div className="panel-row">
            <p className="row-title">并购进程</p>
            <button className="btn btn-active">全部</button>
          </div>
          <div className="panel-row">
            <p className="row-title">并购类型</p>
            <button className="btn btn-active">全部</button>
            <button className="btn btn-active">借壳上市</button>
            <button className="btn btn-active">现金收购</button>
          </div>
          <div className="panel-row">
            <p className="row-title">行业关系</p>
            <button className="btn btn-active">全部</button>
            <button className="btn btn-active">同行收购</button>
            <button className="btn btn-active">跨行业收购</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LeftSelect;
