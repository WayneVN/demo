/**
 * @file 斗米-竞猜页
 * @author min.chen@joudou.com
 */
var React = require('react');
var _ = require('lodash');
var If = require('../../component/if');
var format = require('../../util/format');
var Title = require('./title');
var VS = require('./vs');
var Time = require('./time');
var HeadAction = require('../../actions/headAction');
var DoumiAction = require('../../actions/doumiAction');
var PageEnum = require('../userCenter/config');
var BlackLine = require('./blackLine');

var Guess = React.createClass({


    getInitialState: function () {
        return {
            data: {}
        };
    },


    formatData: function () {
        var me = this;
        var {
            props: {
                data
            }
        } = me;

        var pool = data.pool;

        return {
            vsOpiton: {
                option1: pool.option1,
                option2: pool.option2,
                amount1: pool.amount1,
                amount2: pool.amount2
            }
        }
    },

    bet: function (type) {
        this.props.transfer('bet', {betType: type});
    },

    other: function () {
        DoumiAction.close();
        HeadAction.openUserCenter(PageEnum.userAccount.doumi);
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="guess">
                <Title close={me.props.warning} text='竞猜赢斗米' />

                <BlackLine data={me.props.data}/>

                <div className="content-container">
                    <div className="content">
                        <VS data={data.vsOpiton} />
                        <div>
                            <span className="red-btn" onClick={()=>me.bet(1)}>下注</span>
                            <span className="red-btn black-btn" onClick={()=>me.bet(2)}>下注</span>
                        </div>
                    </div>

                    <div className="footer-container">
                        <span className="other" onClick={me.other}>看看其他竞猜</span>
                        <span className="right" onClick={me.props.close}>稍后再玩</span>
                    </div>
                </div>


            </div>

        );
    }
});

module.exports = Guess;