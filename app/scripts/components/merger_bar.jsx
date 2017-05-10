"use strict";
/**
 *   并购重组－右侧－并购方案
 */
var React = require('react');
var Reflux = require('reflux');
var _ = require('_');
var format = require('../util/format');
import Model from '../model/mergerModal';
const MergerModal = new Model();
var ChartPie = require('./ChartPie');
var numeral = require('numeral');

var MergerBar = React.createClass({

  getInitialState: function() {
    return {
      play: false, //控制是否播放
      id: this.props.params.id,
      info: {
        funds: [{
          "name": "", //名称
          "sub_funds": "", //认购金额
          "sub_num": "" //认购股份
        }],
        acquirer: {
          companies: [{
            name: '',
            market_value: '',
            stockholders: [{
              name: '',
              value: ''
            }]
          }]
        },
        acquiree: {
          companies: [{
            name: '',
            market_value: '',
            stockholders: [{
              name: '',
              value: ''
            }],
          }]
        },
        money: {
          offer_cash: '',
          fund_cash: '',
          fund_stock_num: '',
          fund_stock_price: '',
        }
      }
    };
  },

  _initData: function(id) {
    MergerModal.program(id, data => {
      this.setState({
        info: data
      });
    });
  },

  componentDidMount: function() {
    this._initData(this.props.params.id);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id != this.props.params.id) {
      var id = nextProps.params.id;
      this._initData(id);
    }
  },

  onPlay: function() {
    this.setState({
      play: !this.state.play
    });
  },
  // 右侧圆球排序，重绘大小
  _resize: function(info) {
    const {
      acquiree: {
        companies: list //被收购方数据
      },
      acquirer: {
        companies: bigObj //收购方数据
      }
    } = info;

    const max = 120;
    const min = 80;
    let size = 0;
    let _list = list.sort((a, b) => {
      if (a.market_value == 0) {
        return b.name.replace(/[^0-9]/ig,"") - a.name.replace(/[^0-9]/ig,"");
      }
      return b.market_value - a.market_value;
    });
    for (var i = 0; i < _list.length; i++) {
      // size = (_list.length - i) * 10 + min;
      // （被收购方市值／收购方市值)开8次方*左球面积
      size = Math.sqrt(Math.sqrt(Math.sqrt(_list[i].market_value /  bigObj[0].market_value))) * max;
      _list[i].style = {
        height: Math.ceil(size) <= min ? min : Math.ceil(size),
        width: Math.ceil(size) <= min ? min : Math.ceil(size),
        paddingTop: Math.ceil(size) <= min ? 25 :size / 3 * 1
      };
    }
    return _list;
  },

  render: function() {
    let {
      state: {
        info
      }
    } = this;
    var acquiree = this._resize(info);

    return (
      <div className="chart-merger-bar">
        <div className="chart-merger-head">
          <ul className="chart-list-title">
            <li>
              资金募集方
              <span className={info.money.fund_cash!='0'?(!this.state.play?'chart-icon':'hide'):'hide'}>
                <img src="../images/money.png" />
                {format.moneyFormat(info.money.fund_cash)}
              </span>
              <div className={info.funds.length>0?'chart-tip-info':'chart-tip-info hide'}>
                  <div className="chart-tip-head">
                      资金募集方
                      <span className="arrow-l"></span>
                  </div>
                  <div className='chart-tip-body'>
                    {info.funds.map(function(item,key){
                      return <ul className="chart-tip-list" key={key}>
                              <li className="tip-list-title">{item.name}</li>
                              <li>认购金额:{format.moneyFormat(item.sub_funds)}</li>
                              <li>认购股份:{format.moneyFormat(item.sub_num)}</li>
                            </ul>
                    })}
                  </div>
              </div>
            </li>
            <li>被收购方股东</li>
          </ul>
          <div className="chart-play-bg">
            <p className="chart-play-left">收购方</p>
            <p className="chart-play-right">被收购方</p>
            <a href="javascript:;" onClick={this.onPlay}>
              <div className="chart-play-warp">
                <div className="chart-play-action">
                  {this.state.play?<i className="fa fa-backward"></i>:<i className="fa fa-play"></i>}
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="chart-merger-body">
          <div className={this.state.play?'chart-merger-before hide':'chart-merger-before'}>
            <div className="chart-m-b-l">
              <span className={info.money.offer_cash!='0'?'chart-icon':'hide'}>
                <img src="../images/money.png" />
                <br />{format.moneyFormat(info.money.offer_cash)}
              </span>

              <div className="item-round">
                {info.acquirer.companies[0].name}
                <br />
                {format.moneyFormat(info.acquirer.companies[0].market_value)}
                <div className="chart-tip-info" style={{top:40}}>
                    <div className="chart-tip-head">
                        股东持股比例
                        <span className="arrow-r"></span>
                    </div>
                    <div className="chart-tip-body">
                      <ul className="chart-tip-list">
                        {info.acquirer.companies[0].stockholders.map(function(item,key){
                          return <li key={key}><span className="tip-title-l">{item.name}</span> <span className="tip-title-r">{numeral(item.value).format('0.00%')}</span></li>
                        })}
                      </ul>
                    </div>
                </div>
              </div>
            </div>
            <div className="chart-m-b-r">
              {acquiree.map(function(item,key){
                return <div key={key} className="item-round" style={item.style}>
                          {item.name}
                          <br />
                          {format.moneyFormat(item.market_value)}
                          <div className="chart-tip-info" style={{left:-260,top:item.style.paddingTop}}>
                              <div className="chart-tip-head">
                                  股东持股比例
                                  <span className="arrow-r"></span>
                              </div>
                              <div className="chart-tip-body">
                                <ul className="chart-tip-list">
                                  {item.stockholders.map(function(_item,key){
                                    return <li key={key}>
                                      <span className="tip-title-l">{_item.name}</span>
                                        <span className="tip-title-r">{numeral(_item.value).format('0.00%')}</span>
                                      </li>
                                  })}
                                </ul>
                              </div>
                          </div>
                      </div>
              })}
            </div>
          </div>
          <div className={this.state.play?'chart-merger-after ':'chart-merger-after hide'}>
            <ChartPie data={info} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MergerBar;
