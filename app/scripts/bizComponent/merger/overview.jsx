/**
 * @file 并购-概览
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var config = require('./config');
var format = require('../../util/format');
var echarts = require('echarts/lib/echarts');
var $ = require('jquery');
var If = require('../../component/if');

var Overview = React.createClass({

    _chart: '',

    getInitialState: function () {
        return {
            type: 'inc'
        }
    },

    getDefaultProps: function () {
        return {
            data: {}
        }
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
        var type = me.state.type;
        var data = me.formatData();
        var value = data[type].holderRatio;
        var item = {
            name:'并购',
            type:'pie',
            radius :[55, 70],
            center: ['50%', 100],
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
        var series;

        if (type == 'inc') {
            item.startAngle = 270;
            item.clockwise = false;

            var inc = data.inc;
            var pie1 = _.cloneDeep(item);
            var pie2 = _.cloneDeep(item);
            var pie3 = _.cloneDeep(item);

            pie1.data = me.getChartData(inc.cash / inc.amount, '#f8989a', 'rgba(0,0,0,0)');
            pie2.data = me.getChartData(inc.stock / inc.amount, '#e4493b', 'rgba(0,0,0,0)');
            pie3.data = me.getChartData(inc.holderRatio * inc.stock / inc.amount, '#b00f00', 'rgba(0,0,0,0)');

            pie1.clockwise = true;
            pie2.radius = [55, 75];
            pie3.radius = [75, 90];
            series = [pie1, pie2, pie3];
        }
        else {
            var pie1 = _.cloneDeep(item);
            var pie2 = _.cloneDeep(item);

            pie1.data = me.getChartData(value, 'rgba(0,0,0,0)', '#f99');
            pie2.data = me.getChartData(value, '#c00', 'rgba(0,0,0,0)');

            pie2.radius = [55, 75];
            series = [pie1, pie2];
        }

        return {
            series : series
        }
    },

    getChartData: function (value, color1, color2) {
        return [
            {
                value: value, 
                name: '1',
                itemStyle: {
                    normal: {
                        color: color1
                    }
                }
            },
            {
                value: 1 - value, 
                name: '2',
                itemStyle: {
                    normal: {
                        color: color2
                    }
                }
            }
        ];
    },

    renderFund: function () {
        var me = this;

        me.changeType('fund');
    },

    renderInc: function () {
        var me = this;

        me.changeType('inc');
    },

    changeType: function (type) {
        var me = this;

        me.setState({
            type: type
        }, function () {
            me.renderChart();
        });
    },

    changeShowType: function () {
        var me = this;
        var data = me.formatData();

        me.changeType(data.showGradeType);
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    impact: {
                        impactValueActivism
                    },
                    overview: {
                        before,
                        after,
                        inc,
                        fund
                    }
                }
            },
            state: {
                type
            }
        } = this;

        var temp = type == 'inc' ? inc : fund;

        return {
            before: me.getBefore(before),
            after: me.getAfter(before, after),
            inc: inc,
            fund: fund,
            grade: impactValueActivism.level,
            score: impactValueActivism.value,

            type: type,
            cash: format.addYi(inc.cash),
            stock: format.addYi(inc.stock),
            amount: format.ajustFix(temp.amount / 100000000),
            ratio: temp.holderRatio,

            tip: after.strongStockholderDes || '',
            showGradeType: !fund || !fund.holderRatio || inc.holderRatio >= fund.holderRatio ? 'inc' : 'fund'
        }
    },

    getBefore: function (before) {
        var list = [
            {
                name: '市值',
                text: format.addYi(before.fundamentals.marketValue)
            },
            {
                name: '净利润',
                text: format.addWan(before.fundamentals.netIncome)
            },
            {
                name: 'PE',
                text: before.fundamentals.PE < 0 ? '<0' : format.ajustFix(before.fundamentals.PE)
            },
            {
                name: 'PB',
                text: format.ajustFix(before.fundamentals.PB)
            }
        ];

        before.list = list;

        return before;
    },


    getAfter: function (before, after) {
        var temp = ['marketValue', 'netIncome', 'PE', 'PB'];
        var list = [
            {
                name: '市值',
                text: format.addYi(after.fundamentals.marketValue)
            },
            {
                name: '净利润',
                text: format.addWan(after.fundamentals.netIncome)
            },
            {
              name: 'PE',
              text:  after.fundamentals.PE < 0 ?'<0' : format.ajustFix(after.fundamentals.PE)
            },
            {
                name: 'PB',
                text: format.ajustFix(after.fundamentals.PB)
            }
        ];

        _.forEach(after.stockholders, function (item) {
            var clazz = 'holder-add';
            var flag = true;

            _.forEach(before.stockholders, function (beforeItem) {
                if (item.name == beforeItem.name) {
                    var showBeforeValue = +(+beforeItem.ratio).toFixed(4);
                    var showAfterValue = +(+item.ratio).toFixed(4);
                    flag = false;

                    if (showAfterValue < showBeforeValue) {
                        clazz = 'holder-reduce'
                    }
                    else if (showAfterValue == showBeforeValue) {
                        clazz = 'holder-same';
                    }
                }
            });

            if (flag) {
                clazz = 'holder-add';
            }

            item.clazz = clazz;
        });

        after.list = list;

        return after;
    },


    getTable: function (data, type) {
        var temp = {
            before: '并购前',
            after: '并购后'
        };
        var text = temp[type];

        return (
            <div className={'overview-table ' +type}>
                <div>{text}</div>
                <div className="black-line">基本面</div>
                <table> 
                    <tbody>
                        {
                            data.list.map(function (item) {
                                return (
                                    <tr className={item.clazz || ''}>
                                        <td>{item.name}</td>
                                        <td>
                                            <span>{item.text}</span>
                                            <span className="icon-add"> ↑</span>
                                            <span className="icon-reduce"> ↓</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <div className="black-line">股东</div>

                <table>
                    <tbody>
                        {
                            data.stockholders.map(function (item) {
                                return (
                                    <tr className={item.clazz || ''}>
                                        <td>{item.name}</td>
                                        <td>
                                            <span>{format.percent(item.ratio, 2)}</span>
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

        )
    },

    getGrade: function (data) {
        var me = this;
        var grade = config.gradeActivism;

        return (
            <div ref="tip" className={"grade-tip grade-tip-activism grade-tip-" + data.grade}>
                <div className="color-line">大股东积极性指数 {format.ajustFix(data.score)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>大股东认购比例</td>
                        </tr>                            
                        {
                            grade.map(function (item, index) {
                                return (
                                    <tr className={"tip-" + index}>
                                        <td>{config.gradeText[index]}</td>
                                        <td>{item}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
            </div>
        )
    },

    showTip: function (isHide) {
        var me = this;

        return function (e) {
            var element = me.refs.tip.getDOMNode();

            if (!isHide) {
                me.setTop(e);
            }

            $(element).animate({
                right: isHide ? -500 : -186
            }, {
                queue: false
            });
        }
    },

    setTop: function (e) {
        var element = $(this.refs.tip.getDOMNode());
        if (e.clientY > 420) {
            element.css('top', '80px');
        }
        else {
            element.css('top', '285px');
        }
    },
        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className='content-box overview-box'>
                <div className="name"><span>基本信息</span></div>

                {me.getTable(data.before, 'before')}

                {me.getTable(data.after, 'after')}


                <div className="chart-container">
                    
                    <If when={data.type == 'inc' && data.fund && typeof data.fund.holderRatio == 'number'}>
                        <div className="icon-container" onClick={me.renderFund}>
                        <img className="banner-fdj" src="../../images/fundMoney.png" />
                        </div>
                    </If>
                    
                    <If when={data.type == 'fund' && data.fund && typeof data.fund.holderRatio == 'number'}>
                        <div className="icon-container" onClick={me.renderInc}>
                            <img className="banner-fdj" src="../../images/acquireMoney.png" />
                        </div>
                    </If>

                    <div className="legend-container">
                        <If when={data.type == 'inc'}>
                            <div>
                                <div className="chart-legend cash-legend">{data.cash} 现金</div>
                                <div className="chart-legend stock-legend">{data.stock} 股票</div>
                            </div>
                        </If>
                    </div>

                    <div></div>

                    <div ref="chart" className="chart"></div>

                    <div className="show-text">
                        <div>
                            <span className="number">{data.amount}</span>
                            <span className="unit">亿</span>
                        </div>
                        <If when={data.type == 'inc'}>
                            <div>收购金额</div>
                        </If>

                        <If when={data.type == 'fund'}>
                            <div>配募金额</div>
                        </If>
                    </div>

                    <If when={typeof data.ratio == 'number'}>
                    <div className="text">
                        <div className="first-line">
                            <span className="number">{format.percent(data.ratio, 2)}</span>

                            <If when={data.type == data.showGradeType}>
                                <div className="right" onMouseEnter={me.showTip()} onMouseLeave={me.showTip(true)}>
                                    <div>评级</div>
                                    <div>{config.gradeText[data.grade]}</div>
                                    <div className="qa-mark">?</div>
                                </div>
                            </If>
                        </div>

                        <div>{data.type == 'inc' ? '大股东增发股份占比' : '大股东配募占比'}</div>
                    </div>
                    </If>

                    {me.getGrade(data)}
                    
                </div>
                <div className="stock-tip">{data.tip}</div>
            </div>
        );
    }
});

module.exports = Overview;
