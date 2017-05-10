"use strict";
/**
 * 个股筛选页面＝首页
 */

var React = require('react');
var PanelScreen = require('../components/panel_screening');
var ScreenResult = require('../components/screen_result');
var Home = React.createClass({
  render: function() {
    return (
      <div className="container">
        <PanelScreen />
        <ScreenResult />
      </div>
    );
  }
});

module.exports = Home;
