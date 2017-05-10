/**
 * @file 定增-二级页面
 * @author min.chen@joudou.com
 */
var React = require('react');
var Reflux = require('reflux');
var If = require('../component/if');
var _ = require('lodash');

var model = require('../model/privateModel');
var msgModel = require('../model/msgModel');
var Title = require('../bizComponent/private/title');
var Grade = require('../bizComponent/private/grade');

var Project = require('../bizComponent/private/project');
var Value = require('../bizComponent/private/value');
var Stock = require('../bizComponent/private/stock');

var HeadAction = require('../action/headAction');

var Storage = require('../util/storage').default;
var logger = require('../util/logger');
var LoginStore = require('../store/loginStore');
var url = require('../util/url');
var Loading = require('../component/loading');

var Private = React.createClass({


    mixins: [
        Reflux.connectFilter(LoginStore,'userInfo',function(userInfo) {
            this.getSelfStock();       
        }),
    ],

    getInitialState: function () {
        var data = {};
        if (window._joudou) {
            data = $.extend(true, {}, window._joudou.data);
        }

        return {
            data: data,
            hasData: window._joudou
        };
    },


    componentDidMount: function () {
        var me = this;
        if (!window._joudou) {
            me.getData();
        }
        me.getSelfStock();

        logger.log({
            target: 'msg.private',
            data: {
                eventid: me.getID(),
                code: me.state.data.stock_id
            }
        });
    },

    getID: function () {
        return url.getSearch('id');
    },

    componentWillUnmount: function () {
        HeadAction.setPosition('');
    },


    initDom: function () {
        HeadAction.setPosition('fixed');
    },

    getData: function () {
        var me = this;
        var id = me.getID();

        model.getDetail(id, function (error, data) {

            if (data.status) {

                me.setState({
                    data: data.data,
                    hasData: 1
                });

                me.getSelfStock();
            }
        });
    },

    getSelfStock: function () {
        var me = this;
        var param = me.state.data;
        var userid = new Storage().getStore('USER_ID');

        if (userid && param.stock_id) {
            msgModel.getSelfStock(function (error, data) {
                var hasAdd = 1;

                _.forEach(data.data, function (item, index) {
                    if (item.secucode.toUpperCase() == param.stock_id.toUpperCase()) {
                        hasAdd = 2;
                    }
                });
                me.setState({
                    hasAdd: hasAdd
                })
            });
        }
    },

    clickGrade: function (field) {
        var me = this;
        var element = me.refs.content.getDOMNode();
        var titleNode = me.refs.title.getDOMNode();
        var parentTop = $(element).prop('offsetTop');
        var scrollTop = {
            A: 0,
            C: $(element).find('.stock-panel').prop('offsetTop') - parentTop - 15,
            E: $(element).find('.value').prop('offsetTop') - parentTop - 15
        }

        if (field == 'A') {
            $(titleNode).find('.price').animate({
                top: -1
            });
        }
        else {
            $(titleNode).find('.price').animate({
                top: -36
            });
        }

        $('body').animate({
            scrollTop: scrollTop[field]
        });
    },

    render: function () {
        var me = this;
        var {
            state: {
                data,
                hasAdd,
                hasData
            }
        } = me;

        if (hasData) {
            me.initDom();
        }

        return (
            <div ref="container" className="msg-dialog da-dialog">
                <If when={hasData}>
                    <div>
                    <div>
                        <div className="fix-container">
                            <Title ref="title" data={data} hasAdd={hasAdd}/>
                            <Grade data={data} clickGrade={me.clickGrade}/>
                        </div>
                        </div>
                        
                        <div className="content" ref="content">
                            <div className="content-box">
                                <div className="name"><span>事件简述</span></div>
                                <div className="description">{data.description}</div>
                            </div>

                            <Stock data={data} />

                            <Value data={data} />
                            <Project data={data} />
                        </div>

                    </div>

                </If>

                <If when={!hasData}>
                    <div className="loading-container">
                        <Loading />
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = Private;
