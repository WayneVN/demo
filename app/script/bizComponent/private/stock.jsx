/**
 * @file 定增弹窗-股权变化
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var config = require('./config');
var echarts = require('echarts/lib/echarts');
var format = require('../../util/format');

require('echarts/lib/chart/pie');

var Stock = React.createClass({

    _chart: '',

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    shares_change: {
                        fund_raising,
                        before,
                        after
                    },
                    remark,
                    issue_market,
                    big_shareholder_buy_ratio,
                    level_c,
                    score_C
                }
            }
        } = this;

        _.forEach(after, function (item) {
            var colorClass = 'holder-add';
            var flag = true;

            _.forEach(before, function (beforeItem) {
                if (item.shareholder == beforeItem.shareholder) {
                    var showBeforeValue = +(+beforeItem.ratio).toFixed(4);
                    var showAfterValue = +(+item.ratio).toFixed(4);
                    flag = false;

                    if (showAfterValue < showBeforeValue) {
                        colorClass = 'holder-reduce'
                    }
                    else if (showAfterValue == showBeforeValue) {
                        colorClass = 'holder-same';
                    }
                }
            });

            if (flag) {
                colorClass = 'holder-add';
            }

            item.colorClass = colorClass;
        });

        return {
            before: before,
            after: after,
            remark: remark,
            market: me.getMarket(issue_market),
            ratio: big_shareholder_buy_ratio,
            money: fund_raising,

            grade: level_c,
            score: format.ajustFix(score_C)
        }
    },

    getMarket: function (number) {
        var fix = 1;
        if (number >= 1000000000) {
            fix = 0;
        }
        var temp = format.addUnit(number, fix);
        var len = (parseFloat(temp) + '').length;
        return [parseFloat(temp), temp.substr(len)];
    },

    componentDidMount: function () {
        this.renderChart();
    },

    renderChart: function () {
        var me = this;
        var element = me.refs.chart.getDOMNode();

        if (!me._chart) {
            me._chart = echarts.init(element);
        }

        var option = me.getOption();

        me._chart.clear();
        me._chart.setOption(option);
    },

    getOption: function () {
        var me = this;
        var value = me.props.data.big_shareholder_buy_ratio;
        var item = {
            name:'定增',
            type:'pie',
            radius :[45, 55],
            center: ['50%', 55],
            startAngle: 90 - (1 - value) * 180,
            silent: true,
            itemStyle : {
                normal : {
                    label : {
                        show : false
                    },
                    labelLine : {
                        show : false
                    }
                },
            }
        };

        var pie1 = _.cloneDeep(item);
        var pie2 = _.cloneDeep(item);

        pie1.data = me.getChartData(value, 'rgba(0,0,0,0)', '#f99');
        pie2.data = me.getChartData(value, '#c00', 'rgba(0,0,0,0)');

        pie2.center = ['50%', 60];
        

        return {
            renderAsImage: true,
            series : [pie1, pie2]
        }
    },

    showTip: function (e) {
        this.move(20);
    },

    hideTip: function () {
        this.move(-300);
    },

    move: function (number) {
        var me = this;
        var element = me.refs.tip.getDOMNode();

        $(element).animate({
            right: number
        }, {
            queue: false
        });
    },

    showMoney: function (e) {
        var me = this;
        var element = me.refs.money.getDOMNode();
        me.setTop(element);
        $(element).show();
    },

    setTop: function (element) {
        $(element).css('top', $('body').prop('scrollTop') - 50 + 'px');
    },

    hideMoney: function () {
        var me = this;
        var element = me.refs.money.getDOMNode();

        $(element).hide();
    },

    getChartData: function (value, color1, color2) {
        return [
            {
                value:value, 
                name:'1',
                silent: true,
                itemStyle: {
                    normal: {
                        color: color1
                    }
                }
            },
            {
                value:1 - value, 
                name:'2',
                silent: true,
                itemStyle: {
                    normal: {
                        color: color2
                    }
                }
            }
        ];
    },
        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className='content-box stock-panel'>
                <div className="name"><span>股权变化</span></div>

                <div className="before">
                    <div>定增前</div>
                    <div className="black-line">股东</div>
                    <table> 
                        <tbody>
                        {
                            data.before.map(function (item) {
                                return (
                                    <tr>
                                        <td className="left-text">
                                            <span className="holder-name" title={item.shareholder}>{item.shareholder}</span>
                                        </td>
                                        <td className="right-number">{format.percent(item.ratio)}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>


                <div className="after">
                    <div>定增后</div>
                    <div className="black-line">股东</div>
                    <table>
                        <tbody>
                        {
                            data.after.map(function (item) {
                                return (
                                    <tr className={item.colorClass}>
                                        <td>
                                            <span className="holder-name" title={item.shareholder}>{item.shareholder}</span>
                                        </td>
                                        <td className="right-number">
                                            <span>{format.percent(item.ratio)}</span>
                                            <span className="icon-add"> ↑</span>
                                            <span className="icon-reduce"> ↓</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>


                <div className="chart-container">
                    <div ref="chart" className="chart"></div>
                    <div className="market">
                        <span onMouseEnter={me.showMoney} onMouseLeave={me.hideMoney}>
                            <span className="number">{data.market[0]}</span>
                            <span>{data.market[1]}</span>
                        </span>
                    </div>
                    <div className="text">
                        <div className="arrow-container">
                            <div className="arrow"></div>
                        </div>
                        <div className="first-line">
                            <span className="number">{(data.ratio * 100).toFixed(2)}</span>
                            <span>%</span>

                            <div className="right" onMouseEnter={me.showTip} onMouseLeave={me.hideTip}>
                                <div>评级</div>
                                <div>{config.gradeText[data.grade]}</div>
                                <div className="qa-mark">?</div>
                            </div>
                        </div>
                        <div>大股东认购比例</div>
                    </div>
                </div>
                
                <div className="remark">*{data.remark}</div>

                <div ref="tip" className={"grade-tip grade-tip-" + data.grade}>
                    <div className="color-line">大股东积极性指数 {data.score}</div>
                    <table>
                        <tbody>
                            <tr className="tip-0">
                                <td>高</td>
                                <td>(50%, 100%]</td>
                            </tr>                            
                            <tr className="tip-1">
                                <td>较高</td>
                                <td>(30%, 50%]</td>
                            </tr>                            
                            <tr className="tip-2">
                                <td>中</td>
                                <td>(15%, 30%]</td>
                            </tr>                            
                            <tr className="tip-3">
                                <td>低</td>
                                <td>[0, 15%]</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grade-tip money-tip" ref="money">
                    <div className="color-line">资金募集方</div>
                    <table>
                        <tbody>
                    {
                        data.money.map(function (item) {
                            return (
                                <div>
                                <tr>
                                    <td>{item.shareholder}</td>
                                    <td>认购金额{item.amount >= 1000000000 ? format.addUnit(item.amount, 0) : format.addUnit(item.amount)}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>认购股份{format.addUnit(item.shares)}</td>
                                </tr>
                                </div>
                            )
                        })
                    }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = Stock;
