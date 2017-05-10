'use strict';
/**
 * 每日一股组件
 * @type {*|exports|module.exports}
 */
var React = require('react');
var numeral = require('numeral');
var _ = require('_');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var If = require('../../component/if')
var Tooltip = require('rc-tooltip');
const logger = require('../../util/logger');
var NumStr = require('./numStr');

var Nints = React.createClass({

  propTypes: {
    nints: React.PropTypes.object.isRequired, // 每日一股
    onAddStock: React.PropTypes.func, //添加自选股
    onGood:  React.PropTypes.func, // 点赞
    onBad: React.PropTypes.func, // 点踩
    onNextDay: React.PropTypes.func, // 下一天
    onPrevDay:React.PropTypes.func, // 上一天
  },

  getInitialState() {
    var _nits = _.assign({
      hasAdd: false, // 已添加自选股
      stock_id: '',
      user: { // 是否已赞踩
        up: false,
        down: false,
      },
      next: {}, // 上一天
      prev: {}, // 上一天
    }, this.props.nints);

    return({
      nints: _nits,
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  },


  str2Date(str) {
    let year = str.substr(0,4);
    let m = str.substr(4,2);
    let d = str.substr(6);

    return new Date(`${year}-${m}-${d}`);
  },

  openKLine(stock_id) {
    DialogAction.open(Dialog.StockDialog, {stockId: stock_id});
  },

  renderLable() {
      var list = [];
      let {tags} = this.state.nints;

      if(tags){
        let stock_tags = tags.split(";");
        for(var i in stock_tags){
          if(stock_tags[i]){
            list.push(
              <span className="btn-arrow">
                {stock_tags[i]}
              </span>
            );
          }
        }
      }


    if(list.length == 0){
      return <div />
    }
    else {
      return (
        <div className="nints-lable">
          标签:
          {list}
        </div>
      );
    }

  },

  render() {
    if(!this.state.nints.user) {
      return <div/>
    }

    let {
          hasAdd,
          date,//推荐日期
          img_url, // 每日一股图片
          reason_html, // 内容
          ups, // 赞数
          downs, //踩数
          user:{
            up, // 已赞
            down, // 已踩
          },
          stock_name, //股票名称
          stock_id, //股票代码
          stockRealPrice, //当前股价
          next,
          prev,
          cumulativeDecline, //  累计涨跌幅
          cumulativeDeclinePer, // 累计涨跌幅 百分比
          cumulativeDeclinePerStr,// 累计涨跌幅格式字符串
          riseAndFall, // 涨跌幅
          riseAndFallStr,
          riseAndFallPer, // 涨跌幅百分比
          riseAndFallPerStr,// 涨跌幅百分比格式字符串
          tags,//标签
    } = this.state.nints;

    let tm_stock_name = next.stock_name; // 下一天股票名称
    let tm_stock_id = next.stock_id; // 下一天股票代码
    let ys_stock_name = prev.stock_name;// 上一天股票名称
    let ys_stock_id = prev.stock_id; //上一天股票代码

    let today = new Date();

    let recommendDate = date ? this.str2Date(date) : null;

    let hasYesterday = ys_stock_name; // 有上一天

    let hasTomorrow = tm_stock_name;

    //18点才可以查看下一天
    if(today.Format('yyyyMMdd') == date &&
        today.Format('hh') < 18 ){
      hasTomorrow = false;
    }


    let indexClazz = '';

    if(riseAndFall != 0){
      indexClazz = riseAndFall >= 0 ? 'color-up' : 'color-down';
    }

    let DPClazz = '';

    if(cumulativeDeclinePer && cumulativeDeclinePer != 0){
      DPClazz = cumulativeDeclinePer >= 0 ? 'color-up' : 'color-down';
    }

    let Sign =riseAndFall < 0 ? '' : '+';
    let is = _.find(this.props.addLists, {"secucode":stock_id});

    return(
      <div className="nints">
        <div className="nints-head">
          <div className="nints-date mt10">
            <span className="week">{recommendDate ? recommendDate.pattern('EE') : ''}</span>
            <span>{recommendDate ? recommendDate.Format('MM.dd') : ''}</span>
          </div>

          <table className="nints-table">
            <tr>
              <th>股票名称</th>
              <th>股票代码</th>
              <th className="flr">股价</th>
              <th className="th5">涨跌幅</th>
              <th>
                至今涨跌幅

                <Tooltip placement="bottom" overlay={<div>（实时股价-日历日期当日收盘价）/日历日期当日收盘价 盘间时
                  <br/>
                  （最近一个交易日收盘价-日历日期当日收盘价）/日历日期当日收盘价 收盘时
                </div>} >
                <img src="../images/Symbol3.png" className="th-img ml5"/>
                </Tooltip>
              </th>
            </tr>

            <tr id="nints-stock">
              <td><a href="javascript:;" onClick={() => this.openKLine(stock_id)}>{stock_name}</a></td>
              <td><a href="javascript:;" onClick={() => this.openKLine(stock_id)}>{stock_id? stock_id.split('.')[0] : ''}</a></td>
              <td className={indexClazz}>{stockRealPrice}</td>
              <td className={indexClazz + ' td5'}>
                <If when = {riseAndFallStr} >
                  <NumStr num = {`${riseAndFallStr}(${riseAndFallPerStr})`} />
                </If>
              </td>
              <td className={date >= new Date().Format('yyyyMMdd') ? 'flr' : DPClazz+' flr'}>
                {date >= new Date().Format('yyyyMMdd') ? <span className="mr20">--</span> :
                  <NumStr num = {cumulativeDeclinePerStr} />
                }
              </td>
            </tr>

          </table>

          <If when= {!is} >
            <a href="javascript:;" className="jd-btn jd-btn-orange flr nints-stock"  onClick={this.props.onAddStock}>
              添加自选股
            </a>
          </If>
          <If when= {is} >
            <a href="javascript:;" className="btn-step-next flr btn-step-disabled nints-stock " >
              已添加自选
            </a>
          </If>
        </div>

        <div>
          <div className="fll mr10">
            <div className={`nints-content ${tags && tags.length>0? '' : ' nints-content-notag'}`}>
              {this.renderLable()}
              <div className="mt20" dangerouslySetInnerHTML = {{__html : reason_html}}></div>
            </div>
            <div className="">
              <div className="fll">
                <If when={hasYesterday}>
                <a href="javascript:;"  className="color7" onClick={this.props.onPrevDay}> &#60;上一天 {ys_stock_name}({ys_stock_id})</a>
                </If>
                <If when={!hasYesterday}>
                  <a href="javascript:;" className="disable-a " disabled> &#60;上一天</a>
                </If>
              </div>

              <div className="flr">
                <If when={hasTomorrow}>
                  <a href="javascript:;" className="color7"  onClick={this.props.onNextDay}>{tm_stock_name}{tm_stock_id?"("+tm_stock_id+")":''}下一天 &#62;</a>
                </If>

                <If when={!hasTomorrow}>
                  <a href="javascript:;" className="disable-a" disabled>下一天 &#62;</a>
                </If>
              </div>
            </div>
          </div>

          <div className="flr">
            <img src={img_url} className="nints-img"/>
            <div className="mt20">
              <div className="flr">
                <a href="javascript:;" className="mr20"  onClick={this.props.onGood}>
                  <i className={`fa fa-thumbs-o-up ${!up || 'hasGood'}`}></i>
                    <span className="ml10">
                    {ups}
                    </span>
                </a>
                  <a href="javascript:;"  onClick={this.props.onBad}>
                    <i className={`fa fa-thumbs-o-down ${!down || 'hasBad'}`}></i>
                    <span className="ml10">
                    {downs}
                    </span>
                  </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  },

});

module.exports = Nints;

