"use strict";
/**
 * 个股筛选－三级页面
 */
var React = require('react');
var Reflux = require('reflux');
var time = require('../util/getTime');
// var ChartLine = require("../components/panel_chat_line");
var Listtag = require("../components/list_tag");
var ChartLine = require('../components/ChartLine');
var CompaniesStore = require('../stores/CompaniesStore');
var CompaniesActions = require('../actions/CompaniesActions');
var ChartActions = require('../actions/ChartActions');
var ChartStore = require('../stores/ChartStore');
var RightChartRow = require('./right_charts_row');
var SimilarStore = require('../stores/SimilarStore');
var SimilarActions = require('../actions/SimilarActions');
var _ = require('_');
var Link = require('react-router').Link;
var ContrastActions = require('../actions/ContrastActions');
var ContrastStore = require('../stores/ContrastStore');


var RightChart = React.createClass({
  mixins: [
    Reflux.connect(CompaniesStore, 'info'),
    Reflux.connect(ChartStore, 'price_chart'),
    Reflux.connect(ContrastStore,'btnInfo'),
    Reflux.connect(SimilarStore, 'SimilarData')
  ],
  getInitialState: function() {
    return {
      info: {},
      cacheItem: this.props.cacheItem,
      price_chart: {}, //存储store返回回来的图表数据
      listTag: [],
      btnInfo:{
        merge: {
          events:[
            {
              event_id: null,
              event_name: null,
              occur_time: null,
            }
          ],
          stock_id:'',
          stock_name:''
        }
      },
      SimilarData: [],
      page_num: 1,
      activeTag:''
    };
  },
  componentDidMount: function() {
    var id = this.props.params.id;
    CompaniesActions.getData(id);
    ContrastActions.getData(this.props.params.id);

  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.SimilarData != nextState.SimilarData;
  },
  // 获取当前tag列表选中值
  tagHandler: function(list, init) {
    var self = this;
    var activeTag = '';
    for (var i = 0; i < list.length; i++) {
      if (list[i].clazz == 'active') {
        activeTag = list[i].dataName;
        SimilarActions.getData(this.props.params.id,list[i].dataName, this.state.page_num * 5);
      }
    }
    this.setState({
      listTag: list,
      activeTag:activeTag
    });
  },
  goBack: function() {
    this.props.goBack();
  },
  moreHandle:function(){
    var num = this.state.page_num+1;
    this.setState({page_num:num},function(){
      SimilarActions.getData(this.props.params.id, this.state.activeTag, this.state.page_num * 5);
    });
  },
  render: function() {
    var item = this.state.info;
    var _cacheItem = this.state.cacheItem;
    var SimilarData = this.state.SimilarData;
    var self = this;
    let {internal={events:[{event_id:null}]},merge} = this.state.btnInfo;
    let url = merge.events[0]?'/#/merger/'+merge.events[0].event_id+'/merger':null;
    let uri = internal.events[0]?`/#/merger/${item.stock_id}/${internal.events[0].event_id}/insider`:null;
    return (
      <div className="panel-content goBack animated fadeInRight">
        <div className="panel-left-bar">
          <div className="panel-head">
            <a href="javascript:;">
              <h1 onClick={this.goBack}>{item.stock_id}
                <span>{item.stock_name}</span>
              </h1>
            </a>
            <small>所在行业：{item.industry_third?item.industry_third:item.industry_second}</small>
            <br/>
            <small>所在地：{item.location_first}-{item.location_second}</small>
            <br/>
            <small>企业性质：{item.ownership}</small>
          </div>
          <div className="panel-body">
            {merge.events[0]?
              <a href={url} target="_blank" ><button className="btn btn-active btn-default" disabled={merge.events[0].event_id?false:true}>并购重组</button></a>:
              <button className="btn btn-active btn-default" disabled={merge.events[0]?false:true}>并购重组</button>
            }
            {internal.events[0]?
              <a href={uri} target="_blank" ><button className="btn btn-active btn-default" disabled={internal.events[0].event_id?false:true}>内部交易</button></a>:
              <button className="btn btn-active btn-default" disabled={internal.events[0]?false:true}>内部交易</button>
            }
            <Listtag initCheck={_cacheItem.dataName} isRow={false} stockId={item.stock_id} tagHandler={this.tagHandler}/>
          </div>
        </div>
        <div className="panel-right-bar">
          {
            SimilarData.map(function(_dataKey, _index) {
              var _title = '';
              for (var i = 0; i < Listtag.getListItem().length; i++) {
                if (Listtag.getListItem()[i].dataName == self.state.activeTag) {
                    _title = Listtag.getListItem()[i].name;
                }
              }
              return <ChartLine  name={_dataKey.stock_id+' '+_dataKey.stock_name}
                                 title={_title}
                                 dataName={self.state.activeTag}
                                 data={_dataKey.data}
                                 stockId={_dataKey.stock_id}
                                 clazz="chart-default"
                                 active='active' />

            })
          }
          <a href="javascript:;" className="nextPage " onClick={this.moreHandle}>查看更多</a>
        </div>
      </div>
    );
  }
});

module.exports = RightChart;
