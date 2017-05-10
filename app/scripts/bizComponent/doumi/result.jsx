/**
 * @file 斗米-竞猜结果页
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');
var Title = require('./title');
var ImgPanel = require('./imgPanel');
var _ = require('lodash');
var HeadAction = require('../../actions/headAction');
var DoumiAction = require('../../actions/doumiAction');
var PageEnum = require('../../util/pageEnum');
var BlackLine = require('./blackLine');

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
        var result = data.result;
        var bets = data.bets || [];


        _.forEach(bets, function (item) {
            betedAmount += item.amount;
        });

        return {
            doumi: doumi,
            back: back,
            betNum: bets.length,

            betedAmount: result.iswin ? result.win_amount : betedAmount,
            isWin: result.iswin,
            clazz: result.iswin ? 'result result-win' : 'result result-lose'
        }
    },

    other: function () {
        DoumiAction.close();
        HeadAction.openUserCenter(PageEnum.userAccount.doumi);
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className={data.clazz}>
                <If when={data.isWin}>
                    <Title close={me.props.warning} text='恭喜您猜中！' />
                </If>

                <If when={!data.isWin}>
                    <Title close={me.props.warning} text='您没猜中！' clazz="gray" />
                </If>

                <BlackLine data={me.props.data}/>
                
                <div className="content-container">
                    <ImgPanel />

                    <div className="result-container">
                        <If when={data.isWin}>
                            <div className="result-line">
                                <span>您此次竞猜获得</span>
                                <span className="color-text">{data.betedAmount}</span>
                                <span>斗米</span>
                            </div>
                        </If>
                        <If when={!data.isWin}>
                            <div className="result-line">
                                <span>您此次竞猜失去</span>
                                <span className="color-text">{data.betedAmount}</span>
                                <span>斗米</span>
                            </div>
                        </If>
                        
                        <div>
                            <span>剩余</span>
                            <span className="color-text">{data.doumi}</span>
                            <span>斗米</span>
                            <span className="red-btn" onClick={me.other}>看看其它竞猜</span>
                        </div>

                    </div>
                </div>


            </div>

        );
    }
});

module.exports = Beted;