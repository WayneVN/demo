/**
 * @file 消息神器-列表区域
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var If = require('../../component/if');
var Star = require('../../component/star');
var $ = require('jquery');
var moment = require('moment');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var pollController = require('../../util/pollController');
var config = require('./config');
var Pager = require('react-pager');

var List = React.createClass({

    _pollHandler: '',

    getInitialState: function () {
        return {
            data: {
            }
        };
    },

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    componentDidMount: function() {
        var me = this;

        me.setState(me.props, function () {
            me.addPollHandler();
        });
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
        this.removePollHandler();
        this.addPollHandler();
    },

    componentWillUnmount: function () {
        this.removePollHandler();
    },


    formatData: function () {
        var me = this;
        var {
            state: {
                data
            },
            props: {
                pageNum
            }
        } = me;


        return {
            list: data.announcements,
            currentPage: pageNum - 1,
            totalPage: Math.ceil(data.announcementsAllCnt / config.pageCnt)
        }

    },

    removePollHandler: function () {
        var me = this;
        if (me._pollHandler) {
            pollController.removeStockHandler(me._pollHandler);
        }
    },

    addPollHandler: function () {
        var me = this;
        var stockId = [];
        var list = me.state.data.announcements;

        if (list && list.length) {
            _.forEach(list, function (item) {
                _.forEach(item.data, function (k) {
                    stockId.push(k.stock_id);
                });
            });

            me._pollHandler = pollController.addStockHandler(stockId, function (response) {
                var data = me.state.data;
                var list = data.announcements;
                var flag = false;
                
                _.forEach(list, function (item) {
                    _.forEach(item.data, function (k) {
                        var id = k.stock_id;

                        _.forEach(response, function (stockInfo) {
                            if (stockInfo.stockid.toUpperCase() == id.toUpperCase()) {
                                k.stockStatus = ['suspended', 'limitUp', 'limitDown', ''][stockInfo.trade_status];
                            }
                        });
                    });
                });

                if (flag) {
                    me.setState({
                        data: data
                    });
                }
            }, true);
        }
    },

    getIcon: function (category) {
        var clazz = {
            merger: 'iconfont icon-merger',
            internal: 'iconfont icon-internal',
            'private': 'iconfont icon-private'
        };

        return (
            <i className={clazz[category]} />
        )
    },

    getTitle: function (title, url, id) {
        var me = this;
        return (
            <a target="_blank" href={url}>
                {title}
            </a>
        )
    },

    getStar: function (star) {

        if (typeof star == 'number' && star != -1) {
            return (
                <Star star={star} />
            )
        }

        return '';
    },

    getStockStatus: function (stockStatus) {
        var clazz = 'status-item iconfont ';
        var icon = {
            suspended: 'suspended',
            limitUp: 'topup',
            limitDown: 'topdown'
        };

        if (stockStatus) {
            clazz += 'icon-' + icon[stockStatus];
        }

        return (
            <i className={clazz} />
        );
    },


    getList: function (announcements) {
        var me = this;
        var tr = [];
        var timeClass = !me.state.orderBy ? 'date-order' : '';
        _.forEach(announcements, function (item) {
            tr.push(
                <tr>
                    <td className="group-text">{item.name}</td>
                </tr>
            );
            item.data.map(function (k) {
                tr.push(
                    <tr>
                        <td className={"date-text " + timeClass}>{moment(k.date).format('YYYY/MM/DD')}</td>
                        <td className="icon-item">{me.getIcon(k.category)}</td>
                        <td className="title-text">
                            <If when={k.isNew}>
                                <span className="new-point"></span>
                            </If>
                            {me.getTitle(k.title, k.url, k.id)}
                        </td>
                        <td className="star-item">{me.getStar(k.star)}</td>
                        <td className="status-item-container">{me.getStockStatus(k.stockStatus)}</td>
                        <td className="tag-item">
                            <If when={k.tag}>
                                <span className="msg-tag">{k.tag}</span>
                            </If>
                        </td>
                    </tr>
                )
            })
        });

        return tr;
    },

    handlePageChanged: function (pageNum) {
        this.props.setPage(pageNum + 1);
    },
        
    render: function () {
        var me = this;
        var {
            state: {
                data
            }
        } = me;
        var data = me.formatData();

        return (         
            <div className='msg-list'>
                <If when={data.list && data.list.length}>
                    <table border="0">
                        <tbody>
                        {
                            me.getList(data.list)
                        }
                        </tbody>
                    </table>
                </If>
                <If when={data.list && !data.list.length}>

                    <div className="no-data">暂无数据</div>
                </If>

                <div className="custom_pagination">
                    <Pager total={data.totalPage}
                        current={data.currentPage}
                        titles={{
                            first: '首页',
                            prev: '上一页',
                            prevSet: '...',
                            nextSet: '...',
                            next: '下一页',
                            last: '尾页'
                        }}
                        visiblePages={5}
                        onPageChanged={me.handlePageChanged}/>
                </div>
            </div>
        );
    }
});

module.exports = List;