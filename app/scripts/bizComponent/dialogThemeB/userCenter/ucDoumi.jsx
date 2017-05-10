/**
 * @file 个人中心-我的竞猜
 * @author min.chen@joudou.com
 */
var React = require('react');
var pageEnum = require('../../../util/pageEnum');
var model = require('../../../model/doumiModel');
var VS = require('../../../bizComponent/doumi/vs');
var Time = require('../../../bizComponent/doumi/time');
var _ = require('lodash');
var If = require('../../../component/if');
var moment = require('moment');
var DoumiAction = require('../../../actions/doumiAction');

var UcDoumi = React.createClass({

    getInitialState() {
        return{
        }
    },

    componentDidMount: function () {
        this.getData();
    },

    transfer: function (params) {
        this.props.transfer({
            page: pageEnum.userAccount[params]
        });
    },

    getData: function () {
        var me = this;
        model.getHistory(function (error, data) {
            if (data.status) {
                me.setState({
                    list: data.pools
                })
            }
        })
    },

    render: function () {
        var me = this;

        return (
            <div className="uc-panel-body">
                <div className="uc-left-menu">
                    <ul className="uc-nav">
                        <li onClick={() => {this.transfer('integral')}}>我的积分</li>
                        <li className='uc-left-active'>我的竞猜</li>
                        <li onClick={() => {this.transfer('lottery')}}>我的奖品</li>
                        <li onClick= {() => this.transfer('setting')}>喜好设置</li>
                    </ul>
                </div>

                <div className="uc-right-content">
                    {me.renderDoumi()}
                </div>
            </div>
        );
    },


    formatData: function () {
        var me = this;
        var {
            state: {
                list
            }
        } = me;
        var joinNum = 0;
        var doumiNum = 0;
        var listArray = [];

        _.forEach(list || [], function (item) {
            if (item.bets.length) {
                joinNum ++;
            }

            if (item.result && item.result.win_amount) {
                doumiNum += item.result.win_amount;
            }

            listArray.push(item);
        });

        return {
            joinNum: joinNum,
            notJoinNum: listArray.length - joinNum,
            doumiNum: doumiNum,
            list: listArray
        }
    },

    isOver: function (item) {
        
        return item.status != 'open';
    },

    getBetNum: function (bets) {
        var betNum = 0;

        _.forEach(bets, function (betItem) {
            betNum += betItem.amount;
        });

        return betNum;
    },

    getTimeText: function (item) {
        var me = this;
        var bets = item.bets || [];
        var betNum = me.getBetNum(bets);
        
        if (item.bets.length) {
            if (item.result && item.result.iswin) {
                return (
                    <span>
                        <span>猜中 赢得</span>
                        <span className="color-text">{item.result.win_amount}</span>
                        <span>斗米</span>
                    </span>
                );
            }
            else if (item.result && !item.result.iswin) {
                return (
                    <span>
                        <span>未猜中 失去</span>
                        <span className="color-text">{betNum}</span>
                            <span>斗米</span>
                    </span>
                );
            }
            else {
                return ( 
                    <span>未揭晓</span>
                );
            }
        }
        return (
            <span>已截止</span>
        );
    },

    guess: function (id) {
        model.getPoolData(id, function (error, data) {
            if (data.status) {
                DoumiAction.open({
                    data: data.data
                });
            }
        });
    },

    bet: function (id, optionid) {
        model.getPoolData(id, function (error, data) {
            if (data.status) {
                DoumiAction.open({
                    data: data.data,
                    type: 'bet',
                    betType: optionid
                });
            }
        });
    },

    getStatusText: function (item) {
        var me = this;
        var bets = item.bets || [];


        if (!me.isOver(item)) {
            if (!bets.length) {
                return (
                    <span className="my-btn my-btn-orange" 
                        onClick={()=>me.guess(item.id)}>下注</span>
                )
            }
            else {
                return (
                    <span className={"my-btn my-btn-" + bets[0].pooloption} 
                        onClick={()=>me.bet(item.id, bets[0].pooloption)}>继续下注</span>
                )
            }
        }
        return (<span></span>);
    },

    renderDoumi: function () {
        var me = this;
        
        var data = me.formatData();

        return (
            <div className="user-center-doumi">
                <div className="text-line">
                    <span>您累计竞猜</span> 
                    <span className="color-text">{data.joinNum}</span>
                    <span>个题目  还有</span> 
                    <span className="color-text">{data.notJoinNum}</span>
                    <span>个题目未竞猜</span>
                </div>

                <div className="text-line">
                    <span>您累计竞猜获得</span>
                    <span className="color-text">{data.doumiNum}</span>
                    <span>斗米</span>
                </div>

                <div className="list-container">
                { 
                    data.list.map(function (item) {
                        var option1 = item.option1;
                        var option2 = item.option2;
                        var temp = {
                            option1: item.option1,
                            option2: item.option2
                        }
                        var bets = item.bets || [];
                        var betNum = me.getBetNum(bets);
                        var optionName;
                        
                        if (bets.length) {
                            optionName = 'option' + bets[0].pooloption;
                            temp[optionName] = '[' + temp[optionName] + ' ' + betNum + '斗米]'
                        }

                        var vsOption = {
                            width: 250,
                            option1: temp.option1,
                            option2: temp.option2,
                            amount1: item.amount1,
                            amount2: item.amount2
                        };

                        return (
                            <div className="doumi-item">
                                <div className="first-line">
                                    <span className="doumi-title">{item.title}</span>
                                    <span className="flr">
                                        <If when={me.isOver(item)}>
                                            <span>{me.getTimeText(item)}</span>
                                        </If>
                                        <If when={!me.isOver(item)}>
                                            <Time time={item.settle_time}/>
                                        </If>
                                    </span>
                                </div>

                                <div>
                                    <span className="flr">
                                        {me.getStatusText(item)}
                                    </span>
                                    
                                    <div className="vs-container">
                                        <VS data={vsOption}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
               }
                </div>
            </div>
        )
    }
});

module.exports = UcDoumi;
