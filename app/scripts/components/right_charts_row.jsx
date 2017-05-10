"use strict";
/**
 * 消息神器 筛选结果
 */
const React = require('react');
const Link = require('react-router').Link;
const Reflux = require('reflux');
const ChartLine = require("../components/panel_chat_line");
const Listtag = require("../components/list_tag");
const CompaniesStore =require('../stores/CompaniesStore');
const CompaniesActions = require('../actions/CompaniesActions');
const EchartLine  = require('../components/e_chart_line');
const _ = require('_');
const ChartActions = require('../actions/ChartActions');
const ChartStore = require('../stores/ChartStore');
const time = require('../util/getTime');
const ContrastActions = require('../actions/ContrastActions');
const ContrastStore = require('../stores/ContrastStore');
const format = require('../util/format');

var RightChartRow = React.createClass({
  mixins: [
    Reflux.connect(CompaniesStore,'info'),
    Reflux.connect(ChartStore,'price_chart'),
    Reflux.connect(ContrastStore,'btnInfo')
  ],
  getInitialState:function(){
    return {
      views:false,
      info:{},
      price_chart:{},//存储store返回回来的图表数据
      listTag:[],
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
        },
        internal:{
          events:[
            {
            }
          ]
        }
      }
    };
  },
  componentWillMount: function() {
    // 读取头部信息
    CompaniesActions.getData(this.props.params.id);
    this.getChartData();
    ContrastActions.setData(this.props.params.id);
  },
  // 获取当前tag列表选中值
  tagHandler:function(list,init){
    this.setState({listTag:list},function(){
      init?this.getChartData():this.getChartData(false);
    });
  },
  // 读取当前选中项图表数据
  getChartData:function(){
    var _list = this.state.listTag;
    var cache = [];
    var init = arguments.length == 0?true : false;
    var self = this;
    for (var i = 0; i < _list.length; i++) {
      ChartActions.setData({dataName:_list[i].dataName,id:this.props.params.id,time:time.oneYear(),init:init});
    }
  },
  updateChartData:function(id){
    var _list = this.state.listTag;
    var self = this;
    for (var i = 0; i < _list.length; i++) {
      ChartActions.setData({dataName:_list[i].dataName,id:id,time:time.oneYear(),init:true});
    }
  },
  handleContrast:function(chatType){
    this.props.handleContrast(chatType);
  },
  componentWillReceiveProps: function(nextProps) {
    // 每次传来id 更改图表数据
    if (nextProps.params.id != this.props.params.id) {
      // 传false是确认是保证数据是读后端而不是读缓存
      this.updateChartData(nextProps.params.id);
      CompaniesActions.setData(nextProps.params.id);
      ContrastActions.setData(nextProps.params.id);
    }
  },
  render: function() {
    var item = this.state.info;
    var self = this;
    var title =item.stock_name+'('+item.stock_id+')';
    const keymap = {
      "0": "员工激励",
      "1": "员工激励",
      "2": "大股东增持",
      "3": "公司回购",
      "4": "高管增持",
      "5": "员工持股",
      "6": "大股东减持",
      "7": "高管减持"
    };
    let {internal={events:[{event_id:null}]},merge} = this.state.btnInfo;
    let url = merge.events[0]?'/#/merger/'+merge.events[0].event_id+'/merger':null;
    let uri = internal.events[0]?`/#/merger/${item.stock_id}/${internal.events[0].event_id}/insider`:null;
    return (
      <div className="panel-content animated fadeInRight">
        <div className="panel-head">
          <h2>{title}</h2>
          <div className="icon-group">
            <small>所在行业：{item.industry_third?item.industry_third:item.industry_second}</small>
            <small>所在地：{item.location_first}-{item.location_second}</small>
            <small>企业性质：{item.ownership}</small>
          </div>
        </div>
        <div className="panel-body p20">
          <ul className="link-btn">
            <li className="item-btn">
              {merge.events[0]?
                <a href={url} target="_blank" ><button className="btn btn-active btn-default" disabled={merge.events[0].event_id?false:true}>并购重组</button></a>:
                  <button className="btn btn-active btn-default" disabled={merge.events[0]?false:true}>并购重组</button>}
            </li>
            <li className="item-info">
              {merge.events[0]?merge.events[0].event_name:''}
            </li>
            <li className="item-time">
              <small>{format.stringDateFormat(merge.events[0]?merge.events[0].occur_time:'')}</small>
            </li>
          </ul>
            <ul className="link-btn">
              <li className="item-btn">
                {internal.events[0]?
                  <a href={uri} target="_blank" ><button className="btn btn-active btn-default" disabled={internal.events[0].event_id?false:true}>内部交易</button></a>:
                    <button className="btn btn-active btn-default" disabled={internal.events[0]?false:true}>内部交易</button>
                  }
              </li>
              <li className="item-info" >
                {internal.events[0]?keymap[internal.events[0].event_type]:''}
              </li>
              <li className="item-time">
                <small>{format.stringDateFormat(internal.events[0]?internal.events[0].publish_date:'')}</small>
              </li>
            </ul>
          <hr className="hr" />
          <Listtag isRow={true} initCheck="all" tagHandler={this.tagHandler} stockId={item.stock_id} />
          {this.state.listTag.map(function(tags,key){
            return <EchartLine  name={title} title={tags.name}  dataName={tags.dataName} data={self.state.price_chart}  stockId={item.stock_id} clazz="chart-default" active={tags.clazz} handleContrast={self.handleContrast} />
          })}
        </div>
      </div>

    );
  }
});

module.exports = RightChartRow;
