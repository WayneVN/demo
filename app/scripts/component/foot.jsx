"use strict"
var React = require('react');
var moment = require('moment');
var Footer = React.createClass({
  render: function() {
    return (
      <footer className="footer">
        {/*
          <ul className="foot-nav">
            <li><a href="javascript:;">关于我们</a></li>
            <li><a href="javascript:;">加入我们</a></li>
            <li><a href="javascript:;">合作方式</a></li>
            <li><a href="javascript:;">客户端下载</a></li>
          </ul>
          */}
        <ul className="foot-nav-sm">
          <li><a href="javascript:;">九斗数据版权所有&copy;{ moment().format('YYYY')}</a></li>
          <li><a href="javascript:;">京 ICP 备 14046251 号 - 1</a></li>
        </ul>
      </footer>

    );
  }
});

module.exports = Footer;
