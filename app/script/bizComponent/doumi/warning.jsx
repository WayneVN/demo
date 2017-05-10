/**
 * @file 斗米-提示页
 * @author min.chen@joudou.com
 */
var React = require('react');
var _ = require('lodash');
var If = require('../../component/if');
var format = require('../../util/format');
var Title = require('./title');
var BlackLine = require('./blackLine');

var Warning = React.createClass({


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
                close
            }
        } = me;

        var pool = data.pool;

        return {
            back: back,            
            close: close            
        }
    },

    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="warning">
                <Title text='竞猜赢斗米' />

                <BlackLine data={me.props.data}/>

                <div className="content-container">
                    <div className="content">您不尝试玩一把吗？</div>

                    <div className="btn-container">
                        <span className="my-btn orange" onClick={data.close}>稍后再玩</span>
                        <span className="my-btn gray" onClick={data.close}>不感兴趣</span>
                    </div>
                </div>


            </div>

        );
    }
});

module.exports = Warning;