'use strict';
/**
 * 市场行情指数组件
 * @type {*|exports|module.exports}
 */
var React = require('react');
var numeral = require('numeral');
var Format = require('../../util/format');
var TallyModal = require('../../model/tallyModal')
  .default;
var pollController = require('../../util/pollController');
var Calculation = require('../../util/calculation');

var MarketIndex = React.createClass({

  getInitialState() {
    return ({
      items: [], //指数
    });
  },

  _pollHandlerId: '',

  componentWillMount() {
    this.startPoll();
  },

  componentWillUnmount() {
    pollController.removeStockHandler(this._pollHandlerId);
  },

  startPoll() {

    var me = this;
    me._pollHandlerId = pollController.addIndexHandler(function(data) {
      var indexData = Calculation.indexData(data);

      var items = [];

      for (var i in indexData) {
        items.push(me.renderItem(indexData[i], i == indexData.length -
          1));
      }
      me.setState({
        items: items
      });
    }, true);

  },

  //绘画指数小组件
  renderItem(item, isLast) {
    //number 实时指数  delta 指数涨跌指   rate 指数涨跌百分比 longName 指数名称
    let {
      number,
      delta,
      rate,
      longName
    } = item;
    let isUp = item.delta >= 0; //指数 升,跌
    let clazz = "item ";

    if (delta != 0) {
      clazz += isUp ? "item-red" : 'item-green';
    }

    if (isLast) {
      clazz += ' item-last';
    }

    return (
      <div className={clazz}>
        <div className="item-left">{longName}</div>
        <div className="item-right flr">
          <p className="item-index">{number || number == 0 ?numeral(number).format('0.00') : ''}</p>
          <div className="item-bottom">
          <span className="item-amount">{delta || delta== 0 ? numeral(delta).format('+0.00') : ''}</span>
          <span className="item-grid"><i></i></span>
          <span className="item-per">{rate || rate ==0 ? numeral(rate).format('+0.00%') : ''}</span>
          </div>
        </div>
      </div>
    )
  },

  render() {
    let {
      state: {
        items
      }
    } = this;

    return (
      <div className="market">
        {items}
      </div>
    );
  }
});

module.exports = MarketIndex;
