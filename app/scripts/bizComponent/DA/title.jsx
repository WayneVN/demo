/**
 * @file 定增弹窗-标题行
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
                    title,
                    stock_id,
                    announcement_date,
                    announcement_url,
                    issue_price,
                    level_a,
                    price_category,
                    id,
                    stock_price
                },
                hasAdd
            }
        } = me;

        return {
            title: title,
            date: announcement_date,
            url: announcement_url,
            gradeText: config.gradeText[level_a],
            grade: level_a,
            stockId: stock_id,

            priceCategory: price_category,
            issuePrice: issue_price,
            hasAdd,
            id,
            closePrice: stock_price
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
                    <span>增发价：</span>
                    <span className="number">{(+data.issuePrice).toFixed(2)}</span>

                    <If when={!config.categoryTip[data.priceCategory]}>
                        <span>（{config.category[data.priceCategory]}）</span>
                    </If>                        

                    <If when={config.categoryTip[data.priceCategory]}>
                        <Tooltip placement="bottom" overlay={<span>{config.categoryTip[data.priceCategory]}</span>}>
                            <span>（{config.category[data.priceCategory]}）</span>
                        </Tooltip>
                    </If>
                </span>
            )
        }
    },

    getPrice1: function (param) {
        var issuePrice = +param.issuePrice;
        var closePrice = +param.closePrice;

        return function (data) {

            return (
                <span className="blank">
                    <span className="number">{closePrice.toFixed(2)}</span>
                    <span>（最新收盘价）/ </span>
                    <span className="number">{issuePrice.toFixed(2)}</span>
                    <span>（增发价）= </span>
                    <span className="number">{(closePrice / issuePrice).toFixed(2)}</span>
                </span>
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