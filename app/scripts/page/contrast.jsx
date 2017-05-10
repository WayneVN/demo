"use strict";
/**
 * 消息神器 筛选结果
 */
var React = require('react');
var Link = require('react-router').Link;
var Reflux = require('reflux');
// var LeftSelect =require('../components/left_select');
var LeftSlider = require('../components/left_slider');
var LeftResult = require('../components/left_result');
var RightChart = require('../components/right_charts');
var RightChartRow = require('../components/right_charts_row');
var CompaniesActions = require('../actions/CompaniesActions');
var CompaniesStore =require('../stores/CompaniesStore');

var Contrast = React.createClass({
  getInitialState:function(){
    return {
      views:false,
      cacheItem:{},//缓存点击前的数据
    };
  },
  componentDidMount: function() {
    CompaniesActions.setData(this.props.params.id);
  },
  handleContrast:function(chatType){
    this.setState({views:true,cacheItem:chatType});
  },
  goBack:function(){
    this.setState({views:false});
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id != this.props.params.id) {
      this.setState({views:false});
      CompaniesActions.setData(nextProps.params.id);
    }
  },
  render: function() {
    return (
      <div className="container">
        <div className="panel-left">
          <LeftSlider />
          <LeftResult linkType="contrast" />
        </div>
        <div className="panel-right animated fadeInRight">
          {this.state.views?<RightChart {...this.props} cacheItem={this.state.cacheItem} goBack={this.goBack} /> :<RightChartRow {...this.props}  handleContrast={this.handleContrast}/>}
        </div>
      </div>
    );
  }
});

module.exports = Contrast;
