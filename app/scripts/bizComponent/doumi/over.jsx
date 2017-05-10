/**
 * @file 斗米-结束页
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');
var Title = require('./title');
var BlackLine = require('./blackLine');
var VS = require('./vs');

var Over = React.createClass({


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
                back
            }
        } = me;

        var pool = data.pool;

        return {
            vsOpiton: {
                option1: pool.option1,
                option2: pool.option2,
                amount1: pool.amount1,
                amount2: pool.amount2
            },
            back: back
        }
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="over">
                <Title close={me.props.warning} text='竞猜赢斗米' />

                <BlackLine data={me.props.data}/>

                <div className="content-container">
                    <div className="text-line">
                        <span>已结束</span>
                    </div>
                    <VS data={data.vsOpiton}/>
                </div>

            </div>

        );
    }
});

module.exports = Over;