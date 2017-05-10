"use strict";
/**
 * 消息神器页面
 */

var React = require('react');
var Filter = require('../bizComponent/msg/filter');
var Type = require('../bizComponent/msg/type');
var List = require('../bizComponent/msg/list');
var config = require('../bizComponent/msg/config');
var model = require('../model/msgModel');
var moment = require('moment');
var If = require('../component/if');
var _ = require('lodash');

var MsgPage = React.createClass({

    getInitialState: function () {
        // var now = moment();
        // var fromDate = moment().date(now.date() - 3);
        // var date = {
        //     from: fromDate.format('YYYY-MM-DD'),
        //     to: now.format('YYYY-MM-DD')
        // };

        return {
            category: 'all',
            dateTag: 'latest',
            date: '',
            type: null,
            orderBy: null,
            pageMonth: null,
            pageNum: 1,
            pageCnt: config.pageCnt
        };
    },

    componentDidMount: function () {
        this.getData();
    },

    getData: function (option) {
        var me = this;
        option = option || {};
        var param = me.getParam(option);

        model.getList(param, function (error, data) {
            var state = _.cloneDeep(option);
            if (data.status) {
                state.data = data.data;
                me.setState(state);
            }
        });

    },

    getParam: function (option) {
        var me = this;
        var state = me.state;
        var field = [
            'category', 'dateTag', 'date', 'type',
            'orderBy', 'pageMonth', 'pageNum', 'pageCnt'
        ];
        var param = {};
        var temp = {};

        _.forEach(field, function (item) {
            temp[item] = state[item];
        });

        param = _.assign(temp, _.cloneDeep(option) || {});
        param.date = JSON.stringify(param.date);

        return param;
    },

    clickType: function (type) {
        this.getData({
            category: type,
            type: null,
            orderBy: null,
            pageNum: 1,
            pageMonth: null
        })
    },

    clickChild: function (child) {
        this.getData({
            type: child,
            pageNum: 1,
            pageMonth: null
        });
    },

    clickOrder: function (order) {
        this.getData({
            orderBy: order,
            pageNum: 1,
            pageMonth: null
        });
    },

    setDateTag: function (value) {
        this.getData({
            dateTag: value,
            date: null,
            pageNum: 1,
            pageMonth: null
        });
    },

    setDate: function (date) {
        this.getData({
            dateTag: null,
            date: date,
            pageNum: 1,
            pageMonth: null
        });
    },

    setPage: function (page) {
        this.getData({
            pageNum: page
        });
    },

    setMonth: function (month) {
        this.getData({
            pageMonth: month,
            pageNum: 1
        });
    },
    
    render: function() {
        var me = this;
        var {
            state: {
                data,
                type,
                category,
                dateTag,
                date,
                orderBy,
                pageNum,
                pageMonth
            }
        } = me;

        return (
            <div className="msg-container">
                <If when={data}>
                    <div>
                        <Type data={data} category={category} 
                            type={type} clickType={me.clickType} 
                            clickChild={me.clickChild}/>
                        <Filter setDateTag={me.setDateTag}
                            setDate={me.setDate} clickOrder={me.clickOrder}
                            setPage={me.setPage} setMonth={me.setMonth}
                            category={category} orderBy={orderBy}
                            dateTag={dateTag} date={date}
                            data={data}
                            pageMonth={pageMonth} type={type}/>
                        <List data={data} 
                            setPage={me.setPage}
                            orderBy={orderBy}
                            pageNum={pageNum}/>
                    </div>
                </If>
            </div>
        );
  }
});

module.exports = MsgPage;
