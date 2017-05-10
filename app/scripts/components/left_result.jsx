"use strict";
/**
 *   左边菜单筛选－－结果
 */
var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var ResultActions = require('../actions/ResultActions.js');
var ResultStore = require('../stores/ResultStore.js');
var FilterResultAction = require('../actions/FilterResultAction');
var FilterResultStore = require('../stores/FilterResultStore');
var InternalStore = require('../stores/InternalStore');
var InternalActions = require('../actions/InternalActions');
var _ = require('_');

var LeftResult = React.createClass({
  mixins: [
    Reflux.listenTo(InternalStore,'onMergerList'),
    Reflux.connectFilter(FilterResultStore, 'resultList', function(datalist) {
        var list  = datalist.data;
        if (_.isEmpty(list)) {
          return {};
        }
        var sortData = [];
        for (var i = 0; i < list.length; i++) {
          var obj = {
            stock_id: list[i].stock_id,
            stock_name: list[i].stock_name,
            linkType:this.props.linkType
          };
          sortData.push(obj);
        }
        return sortData;
      })
  ],
  onMergerList: function(data) {
    this.setState({resultList:data.events});
  },

  getInitialState: function() {
      return {
        linkType:this.props.linkType,
        resultList:[],
      };
  },

  componentDidMount: function() {
    // 读取在首页缓存的数据
    this.props.linkType =='merger'?InternalActions.getAll():FilterResultAction.getData();
  },

  render: function() {
    var self = this;
    var elm;
    if (this.props.linkType =='merger') {
      elm =!this.state.resultList?null:this.state.resultList.map(function(item,key){
        return (<tr><td className="list-item-name"><Link to={"/merger/"+item.event_id+"/merger"}>{item.stock_name}</Link></td><td>{item.stock_id}</td></tr>);
      });
    } else {
      elm =!this.state.resultList.hasOwnProperty('length')?null:this.state.resultList.map(function(item,key){
        return (<tr><td className="list-item-name"><Link to={"/contrast/"+item.stock_id}>{item.stock_name}</Link></td><td>{item.stock_id}</td></tr>);
      });
    }

    return (
      <div className="panel-sm">
        <div className="panel-head">
          <p>选股结果</p>
        </div>
        <div className="panel-body">
          <table className="panel-list-sm">
            <tbody>
              <tr>
                {elm}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = LeftResult;
