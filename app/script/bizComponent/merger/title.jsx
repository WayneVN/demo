/**
 * @file 并购-标题行
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var moment = require('moment');
var config = require('./config');
var MsgTitle = require('../msg/title');
var Tooltip = require('rc-tooltip');

var Title = React.createClass({

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

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    meta: {
                        stockId,
                        title,
                        date,
                        fileLink,
                        incStockPrice,
                        fundStockPrice,
                        fundPriceType,
                        priceType,
                        price
                    },
                    process: {
                        before: {
                            fund
                        }
                    },
                    impact: {
                        impactValuePrice
                    }
                },
                hasAdd
            }
        } = me;

        var obj = {
            fund: '配募价',
            inc: '换股价'
        };

        return {
            title: title,
            date: date,
            url: fileLink,
            gradeText: incStockPrice && config.gradeText[impactValuePrice.level],
            grade: impactValuePrice.level,
            stockId: stockId,

            price: incStockPrice,
            price1: fundStockPrice,
            hasAdd: hasAdd,
            fundPriceType: fundPriceType,
            priceTypeText: priceType ? obj[priceType] : '',
            isFund: priceType == 'fund',
            closePrice: price
        }
    },


    getTip: function () {
        return (
            <table>
                <tbody>
                    <tr>
                        <td className="tip-0">高</td>
                        <td className="tip-1">较高</td>
                        <td className="tip-2">中</td>
                        <td className="tip-3">低</td>
                    </tr>
                    <tr>
                        <td className="tip-0">(0, 0.8]</td>
                        <td className="tip-1">(0.8, 1]</td>
                        <td className="tip-2">(1, 1.25]</td>
                        <td className="tip-3">大于1.25</td>
                    </tr>
                </tbody>
            </table>
        )
    },

    getPrice: function (data) {
        return function () {
            return (
                <span>
                    <If when={data.price}>
                        <span>
                            <span>换股价：</span>
                            <span className="number">{(+data.price).toFixed(2)}</span>
                        </span>
                    </If>
                    <If when={data.price1}>
                        <span className="fund-price">
                            <span>配募价：</span>
                            <span className="number">{(+data.price1).toFixed(2)}</span>
                            <If when={data.fundPriceType}>
                                <span>
                                    <If when={!config.categoryTip[data.fundPriceType]}>
                                        <span>({config.priceType[data.fundPriceType]})</span>
                                    </If>
                                    <If when={config.categoryTip[data.fundPriceType]}>
                                        <Tooltip placement="bottom" overlay={<span>{config.categoryTip[data.fundPriceType]}</span>}>
                                            <span>({config.priceType[data.fundPriceType]})</span>
                                        </Tooltip>
                                    </If>
                                </span>
                            </If>
                        </span>
                    </If>
                </span>
            )
        }
    },

    getPrice1: function (param) {
        var price = param.isFund ? param.price1 : param.price;
        var closePrice = +param.closePrice;

        return function (data) {

            return (
                <If when={data.lastPrice && (+price)}>
                    <span className="blank">
                        <span className="number">{closePrice.toFixed(2)}</span>
                        <span> (最新收盘价) / </span>
                        <span className="number">{(+price).toFixed(2)}</span>
                        <If when={param.priceTypeText}>
                            <span> ({param.priceTypeText})</span>
                        </If>
                        <span> = </span>
                        <span className="number">{(closePrice / price).toFixed(2)}</span>
                    </span>
                </If>
            )
        }
    },
    
    render: function () {
        var me = this;
        var data = me.formatData();

        return (     
            <MsgTitle title={data.title} date={data.date} 
                url={data.url} gradeText={data.gradeText}
                stockId={data.stockId} hasAdd={data.hasAdd}
                grade={data.grade}
                getTip={me.getTip}
                getPrice={me.getPrice(data)}
                getPrice1={me.getPrice1(data)}/>
        );
    }
});

module.exports = Title;