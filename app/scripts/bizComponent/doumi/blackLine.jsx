/**
 * @file 斗米框 中间黑线
 * @author min.chen@joudou.com
 */
var React = require('react');
var Time = require('./time');
var If = require('../../component/if');
var HeadAction = require('../../actions/headAction');
var DoumiAction = require('../../actions/doumiAction');
var PageEnum = require('../../util/pageEnum');

var BlackLine = React.createClass({

    other: function () {
        DoumiAction.close();
        HeadAction.openUserCenter(PageEnum.userAccount.doumi);
    },

    formatData: function () {
        var {
            props: {
                data
            }
        } = this;
        var pool = data.pool;

        return {
            time: pool.stop_time,
            title: pool.title,
            status: pool.status,
            optionText: this.getOptionText(data)
        }
    },

    getOptionText: function (data) {
        if (data.pool.status == 'settled') {
            return data.pool['option' + data.pool.final_option];
        }
        
    },

    render: function () {
        
        var data = this.formatData();


        return (
            <div className="black-line">
                {/*<span className="right" onClick={this.other}>其他竞猜</span>  
                <span className="center">
                    <Time time={time} />
                </span>  
                <If when={back}>
                    <span className="left" onClick={back}>《返回</span>
                </If>*/}

                <span>{data.title}</span>  
                <span className="right">
                    <If when={data.status == 'open'}>
                        <Time time={data.time} />
                    </If>

                    <If when={data.status == 'stop'}>
                        <span>已截止</span>
                    </If>

                    <If when={data.status == 'settled'}>
                        <span>正确答案：{data.optionText}</span>
                    </If>
                </span> 
            </div>
        );
    }
});

module.exports = BlackLine;