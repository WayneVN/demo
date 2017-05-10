/**
 * @file 个股弹窗-基本信息
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var Tooltip = require('rc-tooltip');
var AddStockActions = require('../../action/addStockAction');
var If = require('../../component/if');
var pollController = require('../../util/pollController');
var FavorstockModal = require('../../model/favorstockModel');
var logger = require('../../util/logger');
var _ = require('lodash');

var BasicInfo = React.createClass({

    _pollHandlerId: '',

    getInitialState: function () {
        return {
            annoType: '',
            data: {
                common: {},
                marketval: {}
            }
        };
    },

    getDefaultProps: function () {
        return {
            data: {
                common: {},
                marketval: {}
            }
        }
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);

        me.regesterPoll();
    },

    componentWillUnmount: function () {
        pollController.removeStockHandler(this._pollHandlerId);
    },


    regesterPoll: function () {
        var me = this;
        var stockId = me.props.stockId;

        me._pollHandlerId = pollController.addStockHandler([stockId], function (data) {
            var currentPrice = 0;
            var lastPrice = 0;
            var status = 0;

            _.forEach(data, function (item) {
                if (stockId.toUpperCase() == item.stock_id.toUpperCase()) {
                    currentPrice = item.realtime_price;
                    lastPrice = item.last_trade_price;
                    status = item.trade_status;
                }
            })
            
            var deltaPrice = currentPrice - lastPrice;
            var deltaRange = deltaPrice / lastPrice;

            me.setState({
                currentPrice: (+currentPrice).toFixed(2),
                deltaPrice: me.getDeltaPrice(deltaPrice, status),
                deltaRange: me.getDeltaRange(deltaRange, status),
                color: me.getColor(deltaPrice, status)
            });
        }, true);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    formatData: function () {
        var me = this;
        var {
            state: {
                data: {
                    stock_id,
                    common: {
                        stock_name,
                        industry,
                        
                    },
                    subjects,
                    marketval: {
                        price
                    }
                },
                hasAdd,
                currentPrice,
                deltaPrice,
                deltaRange,
                color,
                annoType
            }
        } = me;

        industry = industry || [];

        return {
            name: stock_name,
            code: me.getCode(stock_id),
            price: currentPrice,
            deltaPrice: deltaPrice,
            deltaRange: deltaRange,
            mainTrade: industry.join(' '),
            mainTradeNum: industry.length,
            otherTrade: me.getOtherTrade(subjects),
            marketValue: me.getMarketValue(price),
            color: color,
            tradeNum: me.getTradeNum(subjects),
            hasAdd: hasAdd,
            annoType: annoType
        }
    },

    getCode: function (stock_id) {
        return (stock_id || '').split('.')[0];
    },

    getSymbol: function (number) {
        var symbol = '';

        if (number > 0) {
            symbol = '+';
        }
        
        return symbol;
    },

    getDeltaPrice: function (deltaPrice, status) {
        var symbol = this.getSymbol(deltaPrice);
        if (!status) {
            return '--';
        }

        return symbol + deltaPrice.toFixed(2);
    },

    getDeltaRange: function (deltaRange, status) {
        var symbol = this.getSymbol(deltaRange);

        if (!status) {
            return '停牌';
        }
        return symbol + format.percent(deltaRange, 2);
    },

    getOtherTrade: function (otherTrade) {
        return otherTrade.join(' ');
    },


    getMarketValue: function (marketValue) {
        return format.addUnit(marketValue);
    },

    getTradeNum: function (otherTrade) {
        return (otherTrade || []).length;
    },

    getColor: function (deltaPrice, status) {
        var color = '';

        if (!status) {
            return '';
        }

        if (deltaPrice > 0) {
            color = 'stock-color-red';
        }
        else if (deltaPrice < 0) {
            color = 'stock-color-green';
        }

        return color;
    },

    addStock: function () {
        var me = this;

        FavorstockModal.addStock(me.state.data.stock_id, 
            function(err, result) {
                AddStockActions.refresh();
                me.setState({
                    hasAdd: 2
                },() => {
                    logger.log({
                      target: 'favorstock_secuinfo',
                      data: {
                        plt: 'pc'
                      }
                    });
                });
            }
        );
    },
    
    render: function () {
        var data = this.formatData();

        return (
            <div className={'stock-dialog-basic-info ' + data.color}>
                <span className="close-icon" onClick={this.props.close}><i className="fa fa-times"></i></span>

                { !data.name ? <span></span> :
                <span>
                    <span className="number-container">
                        <span className="name">{data.name}</span>
                        <span className="code">({data.code})</span>
                        <If when={data.price !== undefined}>
                            <span>
                                <span className="price">{data.price}</span>
                                <span className="delta-price">{data.deltaPrice}</span>
                                <span className="delta-range">({data.deltaRange})</span>
                            </span>
                        </If>
                    </span>

                    <span className="market-value">市值：{data.marketValue}</span>
                    
                    <span className="tag-container">

                        <If when={data.mainTradeNum}>
                        <Tooltip placement="bottom" overlay={<span>{data.mainTrade}</span>}>
                            <span className="btn-arrow">
                                主营业务
                                <span className="number">{data.mainTradeNum}</span>
                            </span>
                            
                        </Tooltip>
                        </If>

                        <If when={data.tradeNum}>
                        <Tooltip placement="bottom" overlay={<span>{data.otherTrade}</span>}>
                            <span className="btn-arrow">
                                相关概念
                                <span className="number">{data.tradeNum}</span>
                            </span>
                            
                        </Tooltip>
                        </If>
                    </span>

                    <span className="anno-type" onClick={this.props.toggleAnnoType}>
                        <span className="anno-status">
                            <If when={data.annoType}>
                                <span>&nbsp;</span>
                            </If>

                            <If when={!data.annoType}>
                                <span className="anno-gou">√</span>
                            </If>
                        </span>
                        含预告
                    </span>

                    <If when={data.hasAdd == 1} >
                        <span className="btn" onClick={this.addStock}>+自选</span>
                    </If>

                    <If when={data.hasAdd == 2} >
                        <span className="btn btn-disabled">已添加</span>
                    </If>
                </span>
                }
            </div>
        );
    }
});

module.exports = BasicInfo;
