/**
 * @file 定增列表
 * @author min.chen@joudou.com
 */

var React = require('react');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var model = require('../../model/DAModel');
var _ = require('lodash');
var moment = require('moment');
var Pager = require('react-pager');
var If = require('../../component/if');

var DAList = React.createClass({

    getInitialState: function () {
        return {
            list: []
        }
    },

    componentDidMount: function () {
        this.getData();
    },

    getData: function (pageNum) {
        var me = this;

        model.getList(pageNum, function (error, data) {
            if (data.status) {
                me.setState({
                    list: data.data,
                    totalPage: Math.ceil(data.total / data.page_size),
                    current: data.page_num
                })
            }
        });

    },

    open: function (id, hasDetail, e) {
        if (hasDetail) {
            DialogAction.open(Dialog.DADialog, {id: id});
        }
    },

    formatData: function () {
        var me = this;
        var {
            state: {
                list,
                current,
                totalPage
            }
        } = me;
        var temp = _.cloneDeep(list);

        _.forEach(temp, function (item) {
            var star = [];
            for (var i = 1; i < 6; i ++) {
                if (item.score >= i) {
                    star.push(<i className="fa fa-star" ></i>);
                }
                else if (item.score + 0.5 >= i) {
                    star.push(<i className="fa fa-star-half-o" ></i>);
                }
                else {
                    star.push(<i className="fa fa-star-o"></i>);
                }
            }

            item.star = star;
        });

        return {
            list: temp,
            current: current - 1,
            totalPage: totalPage
        }
    },

    handlePageChanged: function (pageNum) {
        this.getData(pageNum + 1);
    },

    openLinkHandler: function (e) {
        e.stopPropagation();
    },

    render: function () {
        var me = this;
        var data = me.formatData();
        
        return (
            <div className="da-list-container">
                <div className="title">筛选结果</div>
                
                <div className="table-container">
                    <table className="table-list">
                        <thead>
                            <tr>
                            <td>事件描述</td>
                            <td>星级</td>
                            <td>详情</td>
                            <td>公告日期</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.list.map(function (item) {
                                    return (
                                        <tr onClick={function () {me.open(item.id, +item.has_detail)}} 
                                            className={+item.has_detail ? 'has-detail' : ''}>
                                            <td className="left-text">{item.title}</td>
                                            <td className="star">{
                                                item.star.map(function (a) {
                                                    return a
                                                })
                                            }</td>
                                            <td>
                                                <If when={!item.has_detail}>
                                                    <a href={item.announcement_url} target='_blank' onClickCapture={function (e) {me.openLinkHandler(e)}}>
                                                        <img className="pdf-icon" src="../images/pdf.png" />
                                                    </a>
                                                </If>
                                                <If when={+item.has_detail}>
                                                    <img className="pdf-icon" src="../images/pdf.png" />
                                                </If>
                                            </td>
                                            <td>{moment(item.announcement_date + '').format('YYYY-MM-DD')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="custom_pagination">
                    <Pager total={data.totalPage}
                        current={data.current}
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


module.exports = DAList;