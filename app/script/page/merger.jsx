/**
 * @file 并购-二级页面
 * @author min.chen@joudou.com
 */
var React = require('react');
var Reflux = require('reflux');
var Dialog = require('../component/dialog');
var If = require('../component/if');
var _ = require('lodash');

var model = require('../model/mergerModel');
var msgModel = require('../model/msgModel');
var Title = require('../bizComponent/merger/title');
var Grade = require('../bizComponent/merger/grade');
var Description = require('../bizComponent/merger/description');
var Overview = require('../bizComponent/merger/overview');
var Process = require('../bizComponent/merger/process');

var Loading = require('../component/loading');

var Storage = require('../util/storage').default;
var logger = require('../util/logger');
var HeadAction = require('../action/headAction');
var LoginStore = require('../store/loginStore');
var url = require('../util/url');

var Internal = React.createClass({

    _timeoutHandler1: '',
    _timeoutHandler2: '',

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
    },

    componentWillUnmount: function () {
        HeadAction.setPosition();
    },


    initDom: function () {
        HeadAction.setPosition('fixed');
    },

    getID: function () {
        return url.getSearch('id');
    },

    getData: function () {
        var me = this;
        var id = me.getID();

        model.getDetail(id, function (error, data) {
            if (error) {
                return;
            }

            if (data.status) {

                me.setState({
                    data: data.data,
                    hasData: 1
                });

                me.log();

                me.getSelfStock();
            }
        });
    },

    log: function () {
        var me = this;
        logger.log({
            target: 'msg.merger',
            data: {
                eventid: me.getID(),
                code: me.state.data.meta.stockId
            }
        });
    },

    getSelfStock: function () {
        var me = this;
        var param = me.state.data;
        var userid = new Storage().getStore('USER_ID');

        if (userid && param.meta) {
            msgModel.getSelfStock(function (error, data) {
                var hasAdd = 1;

                _.forEach(data.data, function (item, index) {
                    if (item.secucode.toUpperCase() == param.meta.stockId.toUpperCase()) {
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
        var parentTop = $(element).find('.description-box').prop('offsetTop');
        var scrollTop = {
            Growth: $(element).find('.growth-box').prop('offsetTop') - parentTop,
            Price: $(element).find('.process-box').prop('offsetTop') - parentTop,
            Activism: $(element).find('.overview-box').prop('offsetTop') - parentTop,
            Concept: 0
        };
        var flashElement = $('.merger-dialog .description-box .msg-tag');

        me.clearBackgroundColor(flashElement);

        if (field == 'Price') {
            $(titleNode).find('.price').animate({
                top: -1
            });
        }
        else {
            $(titleNode).find('.price').animate({
                top: -36
            });
        }

        if (field == 'Activism') {
            me.refs.overview.changeShowType();
        }
        else if (field == 'Concept') {
            me.flash(flashElement);
        }

        $('body').animate({
            scrollTop: scrollTop[field]
        });
    },

    flash: function (element) {
        var me = this;

        clearTimeout(me._timeoutHandler1);
        clearTimeout(me._timeoutHandler2);
        me.clearBackgroundColor(element);

        me.setBackgroundColor(element);

        me._timeoutHandler1 = setTimeout(function () {
            me.clearBackgroundColor(element);
        }, 500);

        me._timeoutHandler2 = setTimeout(function () {
            me.setBackgroundColor(element);
        }, 1000);
        
    },

    clearBackgroundColor: function (element) {
        $(element).removeClass('special-time');
    },

    setBackgroundColor: function (element) {
        $(element).addClass('special-time');
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
            <div ref="container" className="msg-dialog merger-dialog">
                <If when={hasData}>
                    <div>
                        <div className="fix-container">
                            <Title ref="title" data={data} hasAdd={hasAdd}/>
                            <Grade data={data} clickGrade={me.clickGrade}/>
                        </div>
                        
                        <div className="content" ref="content">
                            <Description data={data} />
                            <Overview ref="overview" data={data} />
                            <Process data={data} />
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

module.exports = Internal;
