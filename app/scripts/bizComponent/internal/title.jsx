/**
 * @file 内部交易-标题行
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var moment = require('moment');
var config = require('./config');
var $ = require('jquery');
var Tooltip = require('rc-tooltip');
var MsgTitle = require('../msg/title');

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
                    stock_id,
                    stock_price,
                    event: {
                        name,
                        publish_date,
                        announcement_url,

                        event_type,
                        price,
                        price_category
                    },
                    serial_events,
                    id
                },
                hasAdd
            }
        } = me;

        return {
            title: me.getTitle(name),
            titleColor: me.getTitleColor(event_type),
            date: publish_date,
            url: announcement_url,
            gradeText: config.gradeText[serial_events.level_price],
            grade: serial_events.level_price,
            stockId: stock_id,

            eventType: event_type,
            priceCategory: price_category,
            price: price,
            hasAdd: hasAdd,
            lastPrice: stock_price,
            hasQaMark: event_type <= 1
        }
    },

    getTitle: function (name) {
        return name.split('，占股比')[0];
    },

    getTitleColor: function (type) {
        return type < 6 ? 'red-title' : 'green-title';
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
        var clazz = data.hasQaMark ? 'has-qa-mark' : 'has-no-qa-mark';
        return function () {
            return (
                <If when={+data.price}>
                <span className={clazz}>
                    <span>{config.priceText[data.eventType]}</span>
                    <If when={data.hasQaMark}>
                        <Tooltip placement="bottom" overlay={<span>{config.priceTip[data.eventType]}</span>}>
                            <div className="qa-mark">?</div>
                        </Tooltip>
                    </If>
                    <span>: </span>
                    <span className="number">{format.ajustEmpty((+data.price).toFixed(2))}</span>
                    <If when={data.priceCategory && config.priceCategory[data.priceCategory]}>
                        <span> ({config.priceCategory[data.priceCategory]}) </span>
                    </If>
                </span>
                </If>
            )
        }
    },

    getPrice1: function (param) {
        var price = +param.price;
        var lastPrice = +param.lastPrice;

        return function (data) {
            return (
                <If when={(+param.eventType) > 1}>
                    <span className="blank">
                        <span className="number">{lastPrice.toFixed(2)}</span>
                        <span> (最新收盘价) / </span>
                        <span className="number">{price.toFixed(2)} </span>
                        <span>({config.priceText[param.eventType]}) </span>
                        <span>= </span>
                        <span className="number">{(lastPrice / price).toFixed(2)}</span>
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
                getPrice1={me.getPrice1(data)}
                titleColor={data.titleColor}/>
        );
    }
});

module.exports = Title;