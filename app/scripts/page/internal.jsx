/**
 * @file 内部交易-二级页面
 * @author min.chen@joudou.com
 */
var React = require('react');
var Reflux = require('reflux');
var Dialog = require('../component/dialog');
var If = require('../component/if');
var _ = require('lodash');

var model = require('../model/internalModel');
var msgModel = require('../model/msgModel');
var Title = require('../bizComponent/internal/title');
var Grade = require('../bizComponent/internal/grade');
var List = require('../bizComponent/internal/list');
var Lock = require('../bizComponent/internal/lock');

var Storage = require('../util/storage').default;
var $ = require('jquery');
var logger = require('../util/logger');
var HeadAction = require('../actions/headAction');
var LoginStore = require('../stores/LoginStore');

var Loading = require('../component/loading');

var Internal = React.createClass({

    _timeoutHandler1: '',
    _timeoutHandler2: '',

    mixins: [
        Reflux.connectFilter(LoginStore,'userInfo',function(userInfo) {
            this.getSelfStock();       
        }),
    ],

    getInitialState: function () {
        return {
            data: {}
        };
    },


    componentDidMount: function () {
        var me = this;
        me.getData();

        logger.log({
            target: 'msg.internal',
            data: {
                eventid: me.props.params.id,
                code: me.state.data.stock_id
            }
        });
    },

    componentWillUnmount: function () {
        HeadAction.setPosition();
    },


    initDom: function () {
        HeadAction.setPosition('fixed');
    },

    getData: function () {
        var me = this;
        var id = me.props.params.id;

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
        var scrollTop = 
            $(element).find('.internal-dialog-list').prop('offsetTop') - parentTop - 15;

        if (field == 'peg') {
            scrollTop = $(element).find('.lock-container').prop('offsetTop') - parentTop - 15;
        }

        if (field == 'price') {
            $(titleNode).find('.price').animate({
                top: -1
            });
            me.clearBackgroundColor('special-span', element);
        }
        else {
            $(titleNode).find('.price').animate({
                top: -36
            });
            me.flash(field, element);
        }


        $('body').animate({
            scrollTop: scrollTop
        });
    },

    flash: function (field, element) {
        var me = this;
        var className = 'special-span';
        var temp = {
            amount: '.list-money-span',
            ratio: '.list-ratio-span',
            price: '.list-price-span'
        };

        var clazz = temp[field];

        clearTimeout(me._timeoutHandler1);
        clearTimeout(me._timeoutHandler2);
        me.clearBackgroundColor(className, element);

        if (clazz) {
            
            me.setBackgroundColor(clazz, className, element);

            me._timeoutHandler1 = setTimeout(function () {
                me.clearBackgroundColor(className, element);
            }, 500);

            me._timeoutHandler2 = setTimeout(function () {
                me.setBackgroundColor(clazz, className, element);
            }, 1000);
        }
        
    },

    clearBackgroundColor: function (className, element) {
        $(element).find('.' + className).removeClass(className);
    },

    setBackgroundColor: function (clazz, className, element) {
        this.clearBackgroundColor(className, element);
        $(element).find(clazz).parents('td').addClass(className);
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
        var eventType = data.event && data.event.event_type;

        if (hasData) {
            me.initDom();
        }

        return (
            <div ref="container" className="msg-dialog internal-dialog">
                <If when={hasData}>
                    <div>
                        <div className="fix-container">
                            <Title ref="title" data={data} hasAdd={hasAdd}/>
                            <Grade data={data} clickGrade={me.clickGrade}/>
                        </div>
                        
                        <div className="content" ref="content">
                            <div className="content-box">
                                <div className="name"><span>事件简述</span></div>
                                <div dangerouslySetInnerHTML={{__html: data.serial_events && data.serial_events.description}} className="description"></div>
                            </div>

                            <If when={eventType != 0 && eventType != 1}>
                                <List ref="list" data={data}/>
                            </If>

                            <If when={eventType == 0 || eventType == 1}>
                                <Lock data={data} />
                            </If>

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
