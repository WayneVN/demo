/**
 * @file 斗米-下注页
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');
var Title = require('./title');
var BlackLine = require('./blackLine');
var ImgPanel = require('./imgPanel');
var _ = require('lodash');
var model = require('../../model/doumiModel');
var HeadAction = require('../../actions/headAction');
var DoumiAction = require('../../actions/doumiAction');
var PageEnum = require('../userCenter/config');
var logger = require('../../util/logger');
var ScoreAction = require('../../actions/scopeActions');

var Bet = React.createClass({


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
        var item1 = [];
        var item2 = [];

        _.forEach([10, 50, 100, 200, 500, 1000], function (item) {
            var temp = {};
            temp.value = item;
            var clazz = 'bet-item';
            if (item > doumi) {
                clazz += ' disabled';
            }

            if (item == 10) {
                clazz += ' current'; 
            }
            temp.clazz = clazz;

            if (item <= 100) {
                item1.push(temp);
            }
            else {
                item2.push(temp);
            }
        });

        return {
            optionClass: 'option-' + type,
            option: pool['option' + type],
            doumi: doumi,
            back: back,
            item1: item1,
            item2: item2
        }
    },

    bet: function () {
        var me = this;
        var pool = me.props.data.pool;
        var element = me.refs.bet.getDOMNode();

        model.bet({
            id: pool.id,
            option: me.props.type,
            amount: $(element).find('.current').data('value')
        }, function () {
            me.props.refresh();
            ScoreAction.getScope();
        });

        logger.log({
            target: 'web_doumi_bet'
        });
    },

    select: function (value, doumi) {
        var me = this;
        var element = me.refs.bet.getDOMNode();

        if (value > doumi) {
            return;
        }

        $(element).find('.current').removeClass('current');
        $(element).find('.bet-item[data-value=' + value + ']').addClass('current');
    },

    getDoumi: function () {
        DoumiAction.close();
        HeadAction.openUserCenter(PageEnum.userAccount.integral);
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="bet">
                <Title close={me.props.warning} text='竞猜赢斗米' />

                <BlackLine data={me.props.data}/>

                <div className="content-container">
                    <ImgPanel />

                    <div className="bet-container" ref="bet">
                        <div className="option-line">
                            <span className={'option ' + data.optionClass}>下注{data.option}</span>
                            {/*<span className="right">
                                <span>赔率</span>
                                <span className="number">1:7</span>
                            </span>*/}
                        </div>

                        <If when={data.doumi >= 10}>
                            <div>
                                <div className="value-line">
                                    您还有<span className="number">{data.doumi}</span>斗米
                                </div>

                                <div>
                                    {
                                        data.item1.map(function (item) {
                                            return (
                                                <span className={item.clazz} 
                                                    data-value={item.value} onClick={()=>me.select(item.value, data.doumi)}>{item.value}</span>
                                            )
                                        })
                                    }
                                </div>

                                <div>
                                    {
                                        data.item2.map(function (item) {
                                            return (
                                                <span className={item.clazz} 
                                                    data-value={item.value} onClick={()=>me.select(item.value, data.doumi)}>{item.value}</span>
                                            )
                                        })
                                    }
                                    <span className="red-btn" onClick={me.bet}>确定</span>
                                </div>
                            </div>
                        </If>

                        <If when={data.doumi < 10}>
                            <div>
                                <div className="special-line">
                                    您<span className="special">斗米不足</span>下注了
                                </div>

                                <div>
                                    <span className="red-btn" onClick={me.getDoumi}>快去得斗米</span>
                                </div>
                            </div>
                        </If>
                    </div>
                </div>


            </div>

        );
    }
});

module.exports = Bet;