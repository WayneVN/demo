/**
 * @file 斗米入口
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');
var model = require('../../model/doumiModel');
var logger = require('../../util/logger');
var _ = require('lodash');
var userInfo = require('../../util/userInfo');
var DialogAction = require('../../actions/dialogAction');
var DoumiAction = require('../../actions/doumiAction');
var Dialog = DialogAction.Dialog;
var Reflux = require('reflux');
var DoumiEntryStore = require('../../stores/doumiEntryStore');


var DoumiEntry = React.createClass({
    mixins: [
        Reflux.listenTo(DoumiEntryStore, '_refresh'),
    ],

    getInitialState: function () {
        return {
            data: {}
        };
    },


    componentDidMount: function () {
        this.getData();

    },

    getData: function (callback) {
        var me = this;

        model.getEntryData(function (error, data) {
            if (data.status) {
                me.setState({
                    data: data.data,
                    number: data.data.pools.length
                });

                callback && callback();
            }
        });
    },

    clickHanlder: function (type) {
        var me = this;
        var param;
        if (userInfo.get().status) {
            param = {
                data: me.state.data.pools[0],
                type: ''
            };
            DoumiAction.open(param);
        }
        else {
            DialogAction.open(Dialog.WechatLogin);
        }
    },

    _refresh: function () {
        var me = this;

        me.getData(function () {
            me.clickHanlder();            
        });
    },


    render: function () {
        var me = this;
        var {
            state: {
                number
            }
        } = me;


        return (
            <div>
                <If when={number}>
                    <div className="doumi-entry" onClick={me.clickHanlder}>
                        <div className="number">{number}</div>
                        <div className="title">竞猜赢斗米</div>
                        <div className="doumi-icon-container">
                            <img className="doumi-icon" src="../images/doumi.png"/>
                        </div>
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = DoumiEntry;