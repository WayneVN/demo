"use strict";

/**
 *
 */

var React = require('react');
var Link = require('react-router').Link;
var Table=require('./table');
// var mergerModal  = require('../model/mergerModal.js');
import Model from '../model/mergerModal';
const  mergerModal  = new Model();

var Progress = React.createClass({
  getInitialState:function(){
    return {
      progress:{
        data:[]
      },
      isSuccess:true,//是否通过
      node:1//节点停止处
    };
  },
  _initData:function(id){
    var self = this;
    mergerModal.procedure(id,function(data){
      var _progress = data.data;
      var _node = 1;
      var _isSuccess = true;
      for (var i = 0; i < _progress.length; i++) {
        if (parseInt(_progress[i].is_pass)==0 ||parseInt(_progress[i].is_pass)==1) {
          _node = i;
          _isSuccess = parseInt(_progress[i].is_pass)==0?(<i className="fa fa-close"></i>):(<i className="fa fa-check"></i>);
        }
      }
      self.setState({
        progress:data,
        node:_node,
        isSuccess:_isSuccess
      });
    });
  },
  componentDidMount:function(){
    var id = this.props.params.id;
    this._initData(id);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id != this.props.params.id) {
      var id = nextProps.params.id;
      this._initData(id);
    }
  },
  render:function(){
    var self = this;
    return (
      <div className="progress">
        <ul className="pro-text">
          {this.state.progress.data.map(function(item,key){
            return <li key={key} >
                      <p>{item.name}</p>
                      <span>{item.start_date}</span>
                    </li>
          })}
        </ul>
        <div className="pro-line">
        <div className="por-line-bg" style={{width:105 * self.state.node }}></div>
          {this.state.progress.data.map(function(item,key){
            var clazz = key<=self.state.node?'pro-d'+(key+1)+' pro-active':'pro-d'+(key+1);
            return <div key={key} className={key== self.state.node?clazz+' pro-status':clazz}>
                        <div className="por-child">{key== self.state.node?self.state.isSuccess:null}</div>
                    </div>
          })}
        </div>
      </div>
    );
  }
});

module.exports = Progress;
