"use strict";
/**
 * 左侧按钮选择面板
 */
var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var ReactSlider = require('../../../node_modules/react-slider/react-slider');
var MergerSelectActions = require('../actions/MergerSelectActions');
var MergerSelectStore = require('../stores/MergerSelectStore');
var CheckSliderBar = require('../components/check_slider_bar');

var LeftSlider = React.createClass({
  mixins: [
    // Reflux.connect(MergerSelectStore,'select')
  ],
  getInitialState: function() {
    return {
      select:{},
      reset: false,
    };
  },
  componentDidMount: function() {
  },
  render: function() {
    return (
      <div className="panel-sm ">
        <div className="panel-head">
          <p>筛选条件</p>
          <Link to="/" className="link-res">重新筛选</Link>
        </div>
        <div className="panel-body">
            <CheckSliderBar name="股价"  dataName='stock_price'/>
            <CheckSliderBar name="市盈率"  dataName='pe'/>
            <CheckSliderBar name="业绩年增速%"  dataName='year_growth'/>
            <CheckSliderBar name="市净率"   dataName='pb'/>
            <CheckSliderBar name="市值/亿"   dataName='market_value'/>
            <CheckSliderBar name="营业收入/亿"  dataName='revenue'/>
            <CheckSliderBar name="当季业绩增速%"  dataName='season_growth'/>
        </div>
      </div>

    );
  }
});

module.exports = LeftSlider;
