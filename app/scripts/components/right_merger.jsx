"use strict";
/**
 * 消息神器 并购重组页面-右侧内容区
 */
const React = require('react');
const Reflux = require('reflux');
const Link = require('react-router').Link;
const Tab = require('../components/tab-lg');
const RightMergerActions = require('../actions/RightMergerActions');
const RightMergerStore = require('../stores/RightMergerStore');
const Progress = require("./progress");
const MergerResult = require('./merger_result');
/* const K = require('./K');*/
const ChartBar = require('./ChartBar');
import Model from '../model/mergerModal';
const MergerModal = new Model();
const MergerBar = require('./merger_bar');
const numeral = require('numeral');
import Converter from './public/converter';

var RightMerger = React.createClass({
  mixins: [
    Reflux
      .connectFilter(RightMergerStore, 'content', function(data) {
        this.setState({
          charts: data
        });
        var list = [];
        // 值转换为星星
        var elmSum = MergerResult.handleStartNum(data.head.impact_value);
        elmSum = parseInt(elmSum);
        for (var i = 0; i < 5; i++) {
          if (elmSum >= i) {
            list.push({
              key: <i className="fa fa-star" key={i}></i>
            });
          } else {
            list.push({
              key: <i className="fa fa-star-o" key={i}></i>
            });
          }
        }
        data.head.impact_value = list;
        return data;
      })
  ],
  getInitialState: function() {
    return {
      charts: {},
      bar:{},
      content: {
        head: {
          impact_value: [],
          event_name: ''
        }
      },
      fundament:{
        acquiree:[],
        acquirer:{//收购方
          stock_name: "",
          stock_id: "",
        },
        merged:{//合并后公司
            stock_name: "",
            stock_id: "",
        }
      }

    };
  },

  _initData:function(id){
    RightMergerActions.getData(id);

    MergerModal.commitment(id, data=> {
      if (data) {
        this.setState({
          bar: {
            ltm: data.hasOwnProperty('acquirer')?data.acquirer.LTM:0,
            totals: data.hasOwnProperty('acquiree')?data.acquiree.total_commitment:0
          }
        });
      }
    });

    MergerModal.fundament(id,data=>{
      this.setState({
        fundament:data
      });
    });
  },

  componentDidMount: function() {
    var id = this.props.params.id;
    this._initData(id);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id != this.props.params.id) {
      var id = nextProps.params.id;
      this._initData(id);
    }
  },

  render: function() {
    var self = this;
    let {
      state: {
        fundament: {
          acquiree: {
            length: len
          }
        },
        content: data,
        /* charts*/
      }
    } = this;

    return (
      <div className="panel-content">
        <div className="panel-head">
          <h2><Converter dataStr={data.head.event_name} _type="link" /></h2>
          <div className="icon-group">
            {
              data.head.impact_value.map((item, key) => item.key)
            }
          </div>
        </div>
        <div className="panel-body">
          {/* <Progress {...this.props}/> */}

          {/* <div className="panel-chart-none">
          <div className="panel-body">
          <K data={charts}/>
          </div>
          </div> */}

          <div className="panel-chart">
            <div className="panel-head">
              <p>
                <span className="crile-l"></span>
                并购方案
                <span className="crile-r"></span>
              </p>
            </div>
            <div className="panel-body">
              <MergerBar  {...this.props}/>
            </div>
          </div>

          <div className="panel-chart">
            <div className="panel-head">
              <p>
                <span className="crile-l"></span>
                净利润
                <span className="crile-r"></span>
              </p>
            </div>
            <div className="panel-body">
              <ChartBar data={this.state.bar}/>
            </div>
          </div>
          <div className="panel-chart">
            <div className="panel-head">
              <p>
                <span className="crile-l"></span>
                市盈率
                <span className="crile-r"></span>
              </p>
            </div>
            <div className="panel-body">
              <table className="table-buy">
                <thead>
                  <tr>
                    <td>收购方</td>
                    <td>合并后</td>
                    <td>被收购方</td>
                    <td>被收购方所在行业</td>
                  </tr>
                </thead>
              </table>
              <ul className="table-buy-body-first ">
                <li style={{height: len * 55,paddingTop:30*(len-1) }}>{self.state.fundament.acquirer.stock_name}({self.state.fundament.acquirer.stock_id})<br/>{numeral(self.state.fundament.acquirer.pe).format('0.0')}</li>
              </ul>
              <ul className="table-buy-body">
                <li style={{height: len * 55,paddingTop:30*(len-1) }}>{self.state.fundament.merged.stock_name}({self.state.fundament.merged.stock_id})<br/>{numeral(self.state.fundament.merged.pe).format('0.0')}</li>
              </ul>
              <ul className="table-buy-body-blue">
                {self.state.fundament.acquiree.map(function(item,key){
                  return <li key={key}>{item.stock_name}<br/>{numeral(item.pe).format('0.0')}</li>
                })}
              </ul>
              <ul className="table-buy-body">
                {self.state.fundament.acquiree.map(function(item,key){
                  return <li key={key} style={{lineHeight:'50px'}}>{item.trade}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RightMerger;
