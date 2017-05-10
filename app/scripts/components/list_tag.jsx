"use strict";
var React = require('react');
var Link = require('react-router').Link;
var ListConfig = require('../util/listConfig');

var ListTag = React.createClass({
  statics: {
    getListItem: function() {
      return ListConfig;
    }
  },
  getDefaultProps:function(){
    return {
      stockId:'',//当前id
      initCheck:'',//初始化渲染的标签
      isRow:false//横竖布局
    };
  },
  getInitialState:function(){
    return {
      _list:[],
      listItem:ListTag.getListItem()
    };
  },
  componentWillMount:function(){
    var check = this.props.initCheck;
    var list = this.state.listItem;
    var id = this.props.stockId;
    if (check == 'all') {
      for (var i = 0; i < list.length; i++) {
        list[i].clazz='active';
        list[i].stockId=id;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].clazz='';
        if (list[i].dataName == check) {
          list[i].clazz='active';
          list[i].stockId=id;
        }
      }
    }
    this.setState({listItem:list});
    this.props.tagHandler(list,true);
  },
  handleActive:function(index){
    return function(){
      var obj = this.state.listItem;
      var _this = this;
      if (this.props.isRow) {
        obj[index].clazz == 'active' ? obj[index].clazz = '': obj[index].clazz='active';
      } else {
        var len = obj.length;
        for (var i = 0; i < obj.length; i++) {
          obj[i].clazz='';
        }
        obj[index].clazz = 'active';
      }
      this.setState({
        listItem:obj
      });
      this.props.tagHandler(obj,false);
    }.bind(this);
  },
  render: function() {
    var cx = React.addons.classSet;
    var clazz = cx({
      "list-tag-row":this.props.isRow,
      "list-tag-cross":!this.props.isRow,
    });
    var _this = this;

    return (
      <ul className={clazz}>
        {this.state.listItem.map(function(item,key){
          return <li className={item.clazz} key={key} onClick={_this.handleActive(key)} ><span className="list-style-dot"></span>{item.name}</li>
        })}
      </ul>
    );
  }
});

module.exports = ListTag;
