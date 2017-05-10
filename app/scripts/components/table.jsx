"use strict";
var React = require('react');
var Link = require('react-router').Link;
var Reflux = require('reflux');
var _ = require('_');
var FilterActions = require('../actions/FilterActions.js');
var format = require('../util/format');
var numeral = require('numeral');
/**
 *  表格组建
 */

var Table = React.createClass({
  propTypes: {
    thead: React.PropTypes.array,
    // data: React.PropTypes.array
  },
  getDefaultProps: function() {
    return {
      data:[]
    };
  },
  getInitialState: function() {
    return {
      isActive: true,
      activeCol:null,
      isSort:true,
      thead:null,
      order:-1
    };
  },
  componentWillMount:function(){
      this.mergerActive();
  },
  // 将传入的props经过修改后存入state
  mergerActive:function(){
    var thead = this.props.thead;
    var len = thead.length;
    var list = [];
    for (var i = 0; i < len; i++) {
      list.push({index:i,name:thead[i].name,sortKey:thead[i].sortKey,clazz:'fa fa-sort'});
    }
    this.setState({thead:list});
  },
  // 改变排序icon方向
  activeClazz:function(key){
    var list  = this.state.thead;
    var i = _.findLastIndex(list, {
      sortKey: key
    });
    var isSort = false;
    switch (list[i].clazz) {
      case 'fa fa-sort':
        list[i].clazz = 'fa fa-sort-asc color-org';
        this.setState({order:1});
        break;
      case 'fa fa-sort-asc color-org':
        list[i].clazz = 'fa fa-sort-desc color-org';
        this.setState({order:-1});
        break;
      case 'fa fa-sort-desc color-org':
        list[i].clazz = 'fa fa-sort-asc color-org';
        this.setState({order:1});
        break;
    }
    this.setState({thead:list});
  },
  sortColum: function(sortKey) {
    var self = this;
    return function() {
      self.activeClazz(sortKey);
      FilterActions.setSortKey({key:sortKey,order:self.state.order});
      FilterActions.sortKey();
    }.bind(this);
  },
  checkView:function(id){
    var self = this;
    return function(){
      self.props.checkView(id);
    }.bind(this);
  },
  render: function() {
    var self = this;
    var is = this.props.isLink;
    var propsData = this.props.data;
    if (_.isEmpty(propsData)) {
      propsData = [];
    }
    // 点击td 后跳转链接
    var _Link =(propsData.map(function (item, i) {
          var id = item.stock_id;
           var el = _.map(item,function(val,key){
             val = key=='pe' || key=='pb'?numeral(val).format('0.0'):val;
             val = key=='stock_price'?numeral(val).format('0.00'):val;
             val = key=='year_growth' || key=='season_growth'?numeral(val).format('0%'):val;
              return  <td key={key} ><Link className="table-link" to={'/contrast/'+id}>{key=='market_value' || key=='revenue' ?format.addCommas(val):val}</Link></td>;
            });
        return <tr key={i}> {el} </tr>;
    }));
    // 点击td后返回callback
    var noLink = (propsData.map(function (item, i) {
           var el = _.map(item,function(val,key){
            val = key=='pe' || key=='pb'?numeral(val).format('0.0'):val;
            val = key=='stock_price'?numeral(val).format('0.00'):val;
            val = key=='year_growth' || key=='season_growth'?numeral(val).format('0%'):val;
              return  <td key={key} onClick={self.checkView(i)} ><a href="javascript:;" className="table-link">{key=='market_value' || key=='revenue' ?format.addCommas(val):val}</a></td>;
            });
        return <tr key={i}> {el} </tr>;
    }));
    var elm = is?_Link:noLink;
    return (
      <table className={this.props.claszz || 'table-base'}>
        <thead>
          <tr>
            {this.state.thead.map(function (item, i) {
                return <td key={i} onClick={self.sortColum(item.sortKey)}>{item.name}&nbsp;<i className={item.clazz} /></td>;
              })}
          </tr>
        </thead>
        <tbody>
          {elm}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
