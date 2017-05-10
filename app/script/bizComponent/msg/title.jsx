/**
 * @file 消息神器三级页面-标题行
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var FavorstockModel = require('../../model/favorstockModel');
var If = require('../../component/if');
var pollController = require('../../util/pollController');
var Logger = require('../../util/logger');
var moment = require('moment');
var DialogAction = require('../../action/dialogAction');
var Dialog = DialogAction.Dialog;

var MsgTitle = React.createClass({

    _pollHandlerId: '',

    getInitialState: function () {
        return {
            data: {
            }
        };
    },

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentWillUnmount: function () {
        pollController.removeStockHandler(this._pollHandlerId);
        this._pollHandlerId = '';
    },

    regesterPoll: function () {
        var me = this;
        var stockId = me.state.stockId;

        if (!me._pollHandlerId && stockId) {

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
                    color: status ? me.getColor(deltaPrice) : '',
                    lastPrice: lastPrice
                });
            }, true);

        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    formatData: function () {
        var me = this;
        var {
            state: {
                title,
                stockId,
                date,
                url,
                gradeText,
                grade,

                getPrice,
                getPrice1,
                getTip,

                hasAdd,
                currentPrice,
                deltaPrice,
                deltaRange,
                color,
                lastPrice,
                titleColor
            }
        } = me;

        var temp = title.split(')');

        return {
            title: temp[1],
            name: temp[0] ? temp[0] + ')' : '',
            price: currentPrice,
            deltaPrice: deltaPrice,
            deltaRange: deltaRange,
            color: color,
            hasAdd: hasAdd,
            grade: grade,

            date: moment(date + '').format('YYYY/MM/DD'),
            url: url,
            gradeText: gradeText,
            lastPrice: lastPrice,
            getPrice: getPrice,
            getPrice1: getPrice1,
            getTip: getTip,
            titleColor: titleColor || ''
        }
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


    getColor: function (deltaPrice) {
        var color = '';

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

        FavorstockModel.addStock(me.props.stockId,
            function(err, result) {
                me.setState({
                    hasAdd: 2
                }, () => {
                  Logger.log({
                    target: 'favorstock_msg',
                    plt: 'pc'
                  });
                });
            }
        );
    },

    showTip: function () {
        this.move(20);
    },

    hideTip: function () {
        this.move(-500);
    },

    move: function (number) {
        var me = this;
        var element = me.refs.tip.getDOMNode();

        $(element).animate({
            right: number
        }, {
            queue: false
        });
    },

    openK: function () {
        var stockId = this.state.stockId;

        DialogAction.open(Dialog.StockDialog, {stockId: stockId});
    },

    login: function () {
        DialogAction.open(Dialog.WechatLogin);
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        if (data.name) {
            me.regesterPoll();
        }

        return (
        <div className="msg-component-title">
            <div className={'da-dialog-title ' + data.titleColor}>
                { !data.name ? <span></span> :
                <span>

                    <span className="text">
                        <span className="name" onClick={me.openK}>
                            <If when={data.title}>
                                <span>
                                    <span className="stock-name">{data.name}</span>
                                    {data.title}
                                </span>
                            </If>

                            <If when={!data.title}>
                                <span>{data.name}</span>
                            </If>
                        </span>
                    </span>

                    <span className="right">
                        <span className="blank">公告日期：{data.date}</span>
                        <If when={data.url}>
                            <span>
                                <a href={data.url} target='_blank'>
                                    <img className="pdf-icon" src="/images/pdf.png" />
                                </a>
                            </span>
                        </If>
                    </span>
                </span>
                }
            </div>

            <div className='abstract'>

                <div className="right">
                    <div className="category">
                        {data.getPrice()}
                        <span className="btn-container">
                            <If when={!data.hasAdd} >
                                <span className="btn" onClick={me.login}><span>+</span>添加自选</span>
                            </If>

                            <If when={data.hasAdd == 1} >
                                <span className="btn" onClick={me.addStock}><span>+</span>添加自选</span>
                            </If>

                            <If when={data.hasAdd == 2} >
                                <span className="btn btn-disabled">已添加</span>
                            </If>
                        </span>

                    </div>
                    <div className="price">
                        {data.getPrice1(data)}
                        <If when={data.gradeText}>
                        <span className="grade">
                            <span className="blank">评级：{data.gradeText}</span>
                            <span className="qa-mark" onMouseEnter={me.showTip} onMouseLeave={me.hideTip}>?</span>
                        </span>
                        </If>
                    </div>
                </div>

                <If when={data.price !== undefined}>
                    <span className={"number-container " + data.color}>
                        <span className="price-number">{data.price}</span>
                        <span className="little-number">{data.deltaPrice}</span>
                        <span className="little-number">（{data.deltaRange}）</span>
                    </span>
                </If>

                <div ref="tip" className={"grade-tip grade-tip-" + data.grade}>
                    {data.getTip()}
                </div>
            </div>
        </div>
        );
    }
});

module.exports = MsgTitle;
