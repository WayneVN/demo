/**
 * @file 斗米-下注结果页
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');
var Title = require('./title');
var BlackLine = require('./blackLine');
var ImgPanel = require('./imgPanel');
var _ = require('lodash');
var HeadAction = require('../../actions/headAction');
var DoumiAction = require('../../actions/doumiAction');
var PageEnum = require('../userCenter/config');

var Beted = React.createClass({


    getInitialState: function () {
        return {
            data: {
            }
        };
    },


    formatData: function () {
        var me = this;
        var {
            props: {
                data,
                back,
                type
            }
        } = me;

        var pool = data.pool;
        var doumi = data.doumi_available;
        var betedAmount = 0;

        _.forEach(data.bets, function (item) {
            betedAmount += item.amount;
        });

        return {
            doumi: doumi,
            back: back,
            betedAmount: betedAmount,
            status: pool.status,
            optionText: me.getOptionText(data)
        }
    },

    getOptionText: function (data) {
        var bets = data.bets || [];
        var option = bets[0].pooloption;
        return data.pool['option' + option];
    },

    bet: function () {
        var me = this;
        var data = me.props.data;
        var bets = data.bets;
        var betType = bets[0].pooloption;

        me.props.transfer('bet', {betType: betType});
    },

    getDoumi: function () {
        DoumiAction.close();
        HeadAction.openUserCenter(PageEnum.userAccount.integral);
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="beted">
                <Title close={me.props.warning} text='竞猜赢斗米' />

                <BlackLine data={me.props.data}/>

                <div className="content-container">
                    <ImgPanel />

                    <div className="beted-container">
                        <div className="beted-line">
                            <span>已下注"{data.optionText}"</span>
                            <span className="color-text">{data.betedAmount}</span>
                            <span>斗米</span>
                        </div>
                        

                        <If when={data.status == 'open'}>
                            <div>
                                <If when={data.doumi >= 10}>
                                    <div>
                                        <span>剩余</span>
                                        <span className="color-text">{data.doumi}</span>
                                        <span>斗米</span>
                                        <span className="red-btn" onClick={me.bet}>继续下注</span>
                                    </div>
                                </If>

                                <If when={data.doumi < 10}>
                                    <div>
                                        <span>剩余斗米</span>
                                        <span className="color-text">不足</span>
                                        <span className="red-btn" onClick={me.getDoumi}>快去得斗米</span>
                                    </div>
                                </If>
                            </div>
                        </If>

                        <If when={data.status != 'open'}>
                            <div>
                                <span>待清算</span>
                            </div>
                        </If>
                    </div>
                </div>


            </div>

        );
    }
});

module.exports = Beted;