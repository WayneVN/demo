"use strict";
var React = require('react');
// var LineChart = require("react-chartjs").Line;
var Link = require('react-router').Link;

var ChartLine = React.createClass({
  getDefaultProps:function(){
    return {
      color:true,
      name:null,
      title:null
    };
  },
  getInitialState:function(){
    return {
      name:this.props.name,
      chartData:{},
    };
  },
  handleContrast:function(){
    this.props.handleContrast('1');
  },
  render: function() {
    return (
      <div className={'panel-chat ' + this.props.clazz}>
        <div className="panel-head">
          <p className="panel-l-name">{this.props.name}</p>
          <p className="panel-l-title">{this.props.title}</p>
          <a href="javascript:;" onClick={this.handleContrast} className="panel-r-contrast">对比</a>
        </div>
        <div className="panel-body">
          <LineChart data={this.state.chartData}  width={this.props.clazz?"625":"548"} height="120"/>
        </div>
      </div>
    );
  }
});

module.exports = ChartLine;
