/**
 * @file 内部交易-评级
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var config = require('./config');
var _ = require('lodash');
var echarts = require('echarts/lib/echarts');
var theme = require('echarts/theme/macarons');

var Lock = React.createClass({

    _chart: [],

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
        var data = me.formatData();
        var performance;

        if (data.list && data.list) {
            _.forEach(data.list, function (item, index) {
                performance = item.performance;

                var element = me.refs['chart-' + index].getDOMNode();
                var option = me.getOption(performance, index);

                if (!me._chart[index]) {
                    me._chart[index] = echarts.init(element, theme);
                }

                me._chart[index].clear();
                me._chart[index].setOption(option);
            });
        }
    },

    getToolTipText: function (name, index) {
        var me = this;
        var data = me.formatData();

        var performance = data.list[index].performance;
        var text = '实际业绩';
        var result;

        _.forEach(performance, function (item) {

            if (item.year == name) {
                if (item.role == 'commitment') {
                    text = '解锁业绩';
                }

                result = text + '<br/>' + name + ' : ' + me.getWanNum(item.value);
            }
        });

        return result;
    },

    getOption: function (data, index) {
        var me = this;

        var xAxisData = me.getXAxisData(data);
        var seriesData = me.getSeriesData(data);
        var yAxis = {
            type : 'value',
            scale: false,
            boundaryGap: [0.2, 0.8],
            axisLine: {
                lineStyle: {
                    color: '#696969'
                }
            },
            axisLabel: {
                formatter: function (value) {
                    return me.getWanNum(value);
                }
            },
            splitLine: {
                show: false
            }
        };

        var flag = true;

        _.forEach(seriesData, function (item) {
            if (item.value < 0) {
                flag = false;
            }
        });

        if (flag) {
            yAxis.min = 0;
        }

        var option = {
            tooltip : {
                trigger: 'axis',
                formatter: function (value) {
                    return me.getToolTipText(value[0].name, index);
                }
            },
            xAxis: [{
                type : 'category',
                boundaryGap : true,
                data : xAxisData,
                axisLine: {
                    lineStyle: {
                        color: '#696969'
                    }
                },
                zlevel: 10
            }],
            yAxis: [
                yAxis
            ],
            series: [
                {
                    name:'业绩',
                    type:'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 1
                        }
                    },
                    barMinHeight: 10,
                    data: seriesData
                }
            ]
        }

        return option;
    },

    getXAxisData: function (data) {
        var result = [];
        var text;

        _.forEach(data, function (item) {
            if (item.role != 'real') {
                text = item.year;

                if (item.role == 'commitment') {
                    text += 'E';
                }
                result.push(text);
            }
        });

        return result;
    },


    getSeriesData: function (data) {
        var me = this;
        var result = [];
        var color = '#cfe0fc';

        _.forEach(data, function (item) {
            if (item.role == 'commitment') {
                color = '#90cdfd';
            }

            if (item.role != 'real') {
                result.push({
                    value: item.value,
                    itemStyle: {
                        normal: {
                            color: color
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function (data) {
                                return me.getWanNum(data.value);
                            }
                        }
                    }
                });
            }
        });

        return result;
    },

    getWanNum: function (number) {
        number = +number;

        return format.addCommas(Math.round(number / 10000)) + '万';
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    event,
                    serial_events
                }
            }
        } = this;

        return {
            list: serial_events.unlock || [],
            serialEvents: serial_events,
            lockType: event.unlock_relation
        }
    },

    getPanel: function (item, index, data) {
        var me = this;

        return (
            <div className="lock-panel">
                <div className="lock-name">{me.getName(item, index, data)}</div>

                <div className="legend-container">
                    {me.getLegend(item, index, data)}
                    <div className="chart-container" ref={'chart-' + index}></div>
                </div>
                <div>{me.getTip(item, index, data)}</div>
            </div>
        )
    },


    getName: function (item, index, data) {
        var text = '解锁指标';

        if (data.list.length > 1) {
            text += (index + 1);
        }

        text += '-' + config.lockType[item.value_type];

        return text;
    },

    showTip: function (isHide) {
        var me = this;

        return function () {
            var element = me.refs.tipPEG.getDOMNode();

            $(element).animate({
                right: isHide ? -260 : 0
            }, {
                queue: false
            });
        }
    },


    movePanel: function (type, isHide) {
        var me = this;

        return function () {
            var element = me.refs[type].getDOMNode();
            var top = -42;
            if (type.indexOf('gr') > -1) {
                top = -78;
            }

            $(element).find('.move-panel').animate({
                top: isHide ? top : 37
            })
        }
    },

    getGradeList: function (grade) {
        var list = [];
        _.forEach(grade, function (item, index) {
            list.push(
                <tr className={"tip-" + index}>
                    <td>{config.gradeText[index]}</td>
                    <td>{item}</td>
                </tr>
            )
        });

        return list;
    },

    getGradeTip: function (item, index, data) {
        var me = this;
        var grade = config.gradePEG;
        
        return (
            <div ref="tipPEG" className={"grade-tip grade-tip-peg grade-tip-" + data.serialEvents.level_peg}>
                <div className="color-line">增速指数 {format.ajustFix(data.serialEvents.score_peg)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>PEG</td>
                        </tr>                            
                        {me.getGradeList(grade)}
                    </tbody>

                </table>
            </div>
        )
    },

    getGRPanel: function (data) {
        var me = this;
        var list = [];

        _.forEach(data.performance, function (item) {
            if (item.role == 'commitment') {
                list.push(item);
            }
        });

        return (
            <div className="move-panel gr-panel">
                <div className="legend-detail">
                    <div className="legend-name">GR</div>
                    <If when={list.length >= 3}>
                        <div className="div-group">
                            <div>= {'{'}(第三年解锁业绩/ 第一年</div>
                            <div className="special">解锁业绩 )^(1 / 2)-1}*100%</div>

                            <div>= {'{'}({format.addWan(list[2] && list[2].value)}/{format.addWan(list[0].value)}) </div>
                            <div className="special">^(1 / 2)-1}*100%</div>
                        </div>
                    </If>

                    <If when={list.length == 2}>
                        <div className="div-group">
                            <div>= {'{'}(第二年解锁业绩/ 第一年</div>
                            <div className="special">解锁业绩 )-1}*100%</div>

                            <div>= {'{'}({format.addWan(list[1].value)}/{format.addWan(list[0].value)})</div>
                            <div className="special">-1}*100%</div>
                        </div>
                    </If>
                    <div>= {format.percent(data.gr, 1)}</div>
                </div>
                <div className="arrow-container"></div>
            </div>
        )
    },

    getLegend: function (item, index, data) {
        var me = this;
        return (
            <div className="lock-legend">
                <div className="lock-grade-container">
                    <If when={item.value_type == 'net_income'}>
                        <div className="lock-grade lock-grade-pe" ref={"pe" + index}
                            onMouseEnter={me.movePanel('pe' + index)} onMouseLeave={me.movePanel('pe' + index, true)}>

                            <div className="move-panel">
                                <div className="legend-detail">
                                    <div className="legend-name">PE</div>
                                    <div>= 市值/第一年解锁业绩</div>
                                    <div>= {format.addYi(+item.market_value)} / {me.getWanNum(+item.ratio_calc_value[0])}</div>
                                    <div>= {format.ajustFix(item.pe)}</div>
                                </div>
                                <div className="arrow-container"></div>
                            </div> 

                            <div className="text-line">
                                <span className="main-text">PE {format.ajustFix(item.pe)}</span>
                            </div>       
                        </div>
                    </If>

                    <div className="lock-grade lock-grade-gr" ref={"gr" + index}
                        onMouseEnter={me.movePanel('gr' + index)} onMouseLeave={me.movePanel('gr' + index, true)}>
                        
                        {me.getGRPanel(item)}


                        <div className="text-line">
                            <span className="main-text">GR {format.percent(item.gr, 1)}</span>
                            <span className="gray-text">(解锁业绩年化增速)</span>
                        </div>
                    </div>

                    <If when={item.value_type == 'net_income'}>
                        <div ref={"peg" + index} className="lock-grade lock-grade-peg" 
                            onMouseEnter={me.movePanel('peg' + index)} onMouseLeave={me.movePanel('peg' + index, true)}>
                            
                            {me.getGradeTip(item, index, data)}

                            <div className="move-panel">
                                <div className="legend-detail">
                                    <div className="legend-name">PEG</div>
                                    <div>= PE/(GR*100)</div>
                                    <div>= {format.ajustFix(item.pe)}/({format.percent(item.gr, 1)}*100)</div>
                                    <div>= {item.gr <= 0 ? '-' : format.ajustFix(item.peg)}</div>
                                </div>
                                <div className="arrow-container"></div>
                            </div>

                            <div className="text-line">
                                <span className="main-text">PEG {item.gr <= 0 ? '-' : format.ajustFix(item.peg)}</span>

                                <If when={item.gr > 0 && item.peg != -1}>
                                <span className="color-text">
                                    <span className="color-text right" 
                                        onMouseEnter={me.showTip()} onMouseLeave={me.showTip(true)}>
                                        <span>评级:{config.gradeText[data.serialEvents.level_peg]}</span>
                                        <span className="qa-mark">?</span>
                                    </span>
                                </span>
                                </If>
                            </div>
                        </div>
                    </If>

                </div>

                <div className="legend-text legend-text-1">实际业绩</div>
                <div className="legend-text legend-text-2">解锁业绩</div>

            </div>
        )
    },

    getTip: function (item, index, data) {
        var list = [];
        
        if (item.value_type == 'net_income') {
            list.push(
                <div className="tip-item">注：净利润为归属于母公司股东的净利润。</div>
            )
        }

        if (index && index == data.list.length - 1) {
            if (data.lockType == 1) {
                list.push(
                    <div className="tip-item">注：多个指标需同时满足才可以解锁。</div>
                );
            }
            else if (data.lockType == 2) {
                list.push(
                    <div className="tip-item">注：任一指标满足即可以解锁。</div>
                )
            }
        }

        return (
            <div className="tip-container">
                {list}
            </div>
        );
    },
        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className="content-box lock-container">
                <div className="name"><span>解锁业绩</span></div>
                {
                    data.list.map(function (item, index) {
                        return me.getPanel(item, index, data);
                    })
                }
            </div>
        );
    }
});

module.exports = Lock;
