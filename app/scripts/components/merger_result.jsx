"use strict";
/**
 * 消息神器 -并购重组－筛选结果
 */
var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MergerResultStore = require('../stores/MergerResultStore');
var MergerResultActions = require('../actions/MergerResultActions');
var InternalActions = require('../actions/InternalActions');
var Pager = require('react-pager');
var Loading = require('./loading');

var MergerResult = React.createClass({
  statics: {
    handleStartNum: function(num){
      num = Math.floor(num /15);
      return  Math.floor(num /2)-1;
    },
  },

  mixins: [
    Reflux.listenTo(MergerResultStore,'getList')
  ],

  getInitialState: function() {
    return {
      total: 10,
      current: 1,
      visiblePage: 5,
      dataList:[],
      loading:true
    };
  },

  componentDidMount: function() {

  },

  getList: function(data) {
    for (var i = 0; i < data.events.length; i++) {
      var list = [];
      // 值转换为星星
      var elmSum = MergerResult.handleStartNum(data.events[i].impact_value);
      for (var j = 0; j < 5; j++) {
        if (elmSum>=j) {
          list.push({key:<i className="fa fa-star" key={j}></i>});
        }else {
          list.push({key:<i className="fa fa-star-o" key={j}></i>});
        }
      }
      data.events[i].impact_value = list;
    }

    var _total = parseInt(data.total/15) + ( data.total%10 ==0 ? 0 :1);
    this.setState({
      dataList:data.events,
      total:_total,
      current:data.page_num -1,
      loading:false
    });
  },

  handlePageChanged: function(newPage) {
    this.setState({ current : newPage });
    InternalActions.page(parseInt(newPage)+1);
  },

  Href: function(id) {
    // window.location.href = `/#/merger/${id}/merger`;
    window.open(`/#/merger/${id}/merger`);
  },

  render: function() {
    let {
      state: {
        loading,
        dataList = [],
        total,
        current,
        visiblePage
      }
    } = this;

    return loading?
    (
      <div className="panel">
        <div className="panel-head">
          <p>筛选结果</p>
        </div>
        <div className="panel-body">
          <Loading />
        </div>
      </div>
    ):(
      <div className="panel">
        <div className="panel-head">
          <p>筛选结果</p>
        </div>
        <div className="panel-body">
          <table className="list-result-default">
            <thead>
              <tr>
                <td>事件描述</td>
                <td>影响程度</td>
                <td>发生日期</td>
              </tr>
            </thead>
            <tbody>
              {
                dataList.map((item, key) => {
                  return <tr key={key} onClick={
                               event => { this.Href(item.event_id) }
                             }>
                        <td>{item.event_name}</td>
                        <td>
                          <div className="icon-group">
                            {
                              item.impact_value.map((_item, key) => _item.key)
                            }
                          </div>
                        </td>
                          <td>
                              {
                                item.occur_time.substr(0,4)+'-'+item.occur_time.substr(4,2)+'-'+item.occur_time.substr(6,2)
                              }
                          </td>
                      </tr>
                })
              }

            </tbody>
          </table>
          <div className="custom_pagination">
              <Pager total={total}
                     current={current}
                     titles={{
                             first:   '首页',
                             prev:    '上一页',
                             prevSet: '...',
                             nextSet: '...',
                             next:    '下一页',
                             last:    '尾页'
                         }}
                     visiblePages={visiblePage}
                     onPageChanged={this.handlePageChanged}/>
         </div>
        </div>
      </div>
    );
  }
});

module.exports = MergerResult;
