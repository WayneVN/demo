"use strict";
var React = require('react');
var CheckBox = require('./checkbox');
var CheckActions  = require('../actions/CheckActions');
var CheckStore  = require('../stores/CheckStore');
var Reflux = require('reflux');

var CheckPanel = React.createClass({
  getInitialState: function() {
    return {
      isHide: true,
      isShow: false,
      btnName:'全部'
    };
  },
  getDefaultProps: function() {
    return {
      type: false, //true= check  ,false=radio
    };
  },
  _open: function() {
    this.setState({
      isHide: false
    });
  },
  _close: function() {
    this.setState({
      isHide: true
    });
  },
  componentDidMount: function() {
  },
  returnVal:function(checkList,dataName){
    this.props.returnVal(checkList,dataName);
    var btnName = '';
    for (var i = 0; i < checkList.length; i++) {
      if (checkList[i].clazz) {
          btnName=checkList[i].name;
      }
    }
    this.setState({btnName:btnName});
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'checkPanels': true,
      'animated': true,
      'fadeInUp': !this.state.isHide,
      'hide': this.state.isHide
    });
    return (
      <div className="panel-row" onMouseLeave={this._close} style={{marginBottom:5}}>
        <div className="row-por" >
          <div className={classes} ref='checkPanel'>
            <div className="checkBody">
              <CheckBox  dataName={this.props.dataName} checkItem={this.props.checkItem}  returnVal={this.returnVal} initVal={this.returnVal} simple={true}/>
            </div>
            <div className="checkFooter">
              <i className="arrow"></i>
            </div>
          </div>
        </div>
        <div className="row-panel" onMouseDown={this._open}>
          <p className="row-title" style={{marginBottom:5}} >{this.props.name}</p>
          <a className="btn btn-active" onMouseEnter={this._open} href="javascript:;">{this.state.btnName}</a>
        </div>
      </div>
    );
  }
});

module.exports = CheckPanel;
