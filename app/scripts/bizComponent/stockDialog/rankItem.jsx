/**
 * @file 个股弹窗-排名项
 * @author min.chen@joudou.com
 */

var React = require('react');
var Gauge = require('../../component/gauge');
var If = require('../../component/if');
var config = require('./config');
var format = require('../../util/format');
var Tooltip = require('rc-tooltip');
var stockDialogAction = require('../../actions/stockDialogAction');
var logger = require('../../util/logger');
var echarts = require('echarts/lib/echarts');

var $ = require('jquery');

var RankItem = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    render: function () {
        var me = this;
        var {
            state: {
                annoType
            },
            props: {
                type,
                data
            }
        } = me;
        var chartData = me.getChartData(type, data);
        var hasData = me.hasData(type, data);

        return (
            <div className="rank-item">
                <div className="name">
                {me.getName(type)}
                </div>
                <If when={hasData}>
                    <div className="content">
                        {me.getLeftContent(type, data, annoType)}
                        <div ref="chartContainer" className="right-container" onMouseEnter={me.showHistory} onMouseLeave={me.hideHistory}>
                            <div className="chart-panel">
                                <Gauge data={chartData.rankData}/>
                                <div className="text">
                                    <span className="left">高于</span>
                                    <span className="center-text">{chartData.rankData.data[0].value}%</span>
                                    <span className="right">上市公司</span>
                                </div>
                            </div>

                            <div className="chart-panel last-chart">
                                <Gauge data={chartData.historyRankData}/>
                                <div className="text">
                                    <span className="left">位于</span>
                                    <span className="center-text">{chartData.historyRankData.data[0].value}%</span>
                                    <span className="right">历史高位</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </If>

                <If when={!hasData}>
                    <div className="no-data">暂无数据</div>
                </If>
            </div>
        );
    },

    hasData: function (type, data) {
        return $.isNumeric(data[type].rank);
    },

    getName: function (index) {
        var result = config.rankTypeNames[index];
        if (typeof result != 'string') { return result[0]; }
        return result;
    },

    showLine: function (type) {
        stockDialogAction.showLine(type);
        logger.log({
            target: 'web_k_dialog_line_open'
        });
    },

    getTip: function (data, text, type) {
        var me = this;
        var tipText = '';
        var hasForecast = data.hasForecast;
        var text1;
        var text2;
        var value1;
        var value2;


        if (!type) {
            text1 = '含' + me.getQuarterText(data.currentDate, 1) + '预告';
            text2 = '不含预告';
            value1 = data.value || '--';
            value2 = data.value1 || '--';
        }
        else {
            text1 = me.getQuarterText(data.currentDate, 1) + '预告';
            text2 = me.getQuarterText(data.currentDate);
            value1 = data.rate ? (+data.rate).toFixed(1) + '%'  : '--';
            value2 = data.rate1 ? (+data.rate1).toFixed(1) + '%'  : '--';
        }

        return (
            <div className="stock-dialog-tip">
                <If when={hasForecast}>
                    <div>
                        <div>{text}</div>
                        <div>
                            <span>{text1}</span>
                            <span className="number">{value1}</span>
                        </div>
                        <div>
                            <span>{text2}</span>
                            <span className="number">{value2}</span>
                        </div>
                    </div>
                </If>

                <If when={!hasForecast}>
                    <div>
                        <span>{text}</span>
                        <span className="number">{value2}</span>
                    </div>
                </If>
            </div>
        )
    },

    getLeftContent: function (type, data, annoType) {
        var me = this;
        var item = data[type];

        return(
            <div className="left-container">
                <If when={!(+type)}>
                    <div>
                    <If when={annoType || !item.hasForecast}>
                    <div>
                        <div className="small-line">
                            <If when={item.hasForecast}>
                                <span>含预告:{me.getBigNumber(item.value)}</span>
                            </If>
                        </div>
                        <Tooltip placement="left" overlay={me.getTip(item, '当前市盈率', type)}>
                            <div className="big-line" onClick={()=>me.showLine(0)}>
                                {me.getBigNumber(item.value1)}
                            </div>
                        </Tooltip>
                    </div>
                    </If>

                    <If when={!annoType && item.hasForecast}>
                    <div>
                        <div className="small-line">不含预告:{me.getBigNumber(item.value1)}</div>
                        <Tooltip placement="left" overlay={me.getTip(item, '当前市盈率', type)}>
                            <div className="big-line" onClick={()=>me.showLine(0)}>
                                {me.getBigNumber(item.value)}<span className={(me.getPercent(item.quarterRate) + '').length > 4 ? "small-text special-text" : "small-text"}>(预)</span>
                            </div>
                        </Tooltip>
                    </div>
                    </If>
                    </div>
                </If>

                <If when={type == 1}>
                    <div>
                        <div className="small-line"></div>
                        <Tooltip placement="left" overlay={
                            <div className="stock-dialog-tip"><span>当前市净率</span><span className="number">{item.value}</span></div>
                        }>
                            <div className="big-line" onClick={()=>me.showLine(1)}>
                                {me.getBigNumber(item.value)}
                            </div>
                        </Tooltip>
                    </div>
                </If>

                <If when={type == 2}>
                    <div>
                        <div className="small-line">
                            <span className="date">{me.getQuarterText(item.date)}:</span>
                            <span className="number">{me.addUnit(item.value)}</span>
                        </div>
                        <Tooltip placement="left" overlay={me.getTip(item, '净利增速（同比）', type)}>
                            <div className="big-line-1" onClick={()=>me.showLine(2)}>
                                {me.getPercent(item.quarterRate)}
                                <If when={!annoType && item.hasForecast}>
                                    <span className={me.getPercent(item.quarterRate).length > 4 ? "small-text special-text" : "small-text"}>(预)</span>
                                </If>
                            </div>
                        </Tooltip>

                    </div>
                </If>

                <If when={type == 3}>
                    <div>
                        <div className="small-line">
                            <span className="date">{me.getQuarterText(item.date)}:</span>
                            <span className="number">{me.addUnit(item.value)}</span>
                        </div>
                        <Tooltip placement="left" overlay={me.getTip(item, '营收增速（同比）', type)}>
                            <div className="big-line-1" onClick={()=>me.showLine(3)}>
                                {me.getPercent(item.quarterRate)}
                                <If when={!annoType && item.hasForecast}>
                                    <span className={me.getPercent(item.quarterRate).length > 4 ? "small-text special-text" : "small-text"}>(预)</span>
                                </If>
                            </div>
                        </Tooltip>
                    </div>
                </If>

            </div>
        )
    },


    // 获取季度显示的文字，后端返回的格式201601
    getQuarterText: function (date, delta) {
        var temp = date + '';
        var y = temp.substr(2, 2);
        var q = Math.ceil(+temp.substr(4) / 3);

        delta = delta || 0;

        if (q + delta > 4) {
            q = 1;
            y = +y + 1;
        }
        else {
            q = q + delta;
        }

        return y + 'Q' + q;
    },


    getBigNumber: function (number) {
        if (!number) {
            return '--';
        }
        number = +number;
        var result = number.toFixed(1);
        if (number >= 1000) {
            result = '>999';
        }
        else if (number <= -1000) {
            result = '<-999';
        }
        else if (number >= 100 || number <= -100) {
            result = number.toFixed(0);
        }

        return result;
    },

    getPercent: function (number) {
        var result = (+number).toFixed(1) + '%';

        if (!number) {
            return '--';
        }

        if (number > 999) {
            result = '>999%';
        }
        else if (number >= 100) {
            result = (+number).toFixed(0) + '%';
        }
        else if (number < -999) {
            result = '<-999%';
        }
        else if (number <= -100) {
            result = (+number).toFixed(0) + '%';
        }

        return result;
    },

    addUnit: function (number) {
        var result = format.addUnit(number);
        var temp = parseFloat(result);

        if (temp >= 100) {
            result = format.addUnit(number, 0);
        }
        return result;
    },

    showHistory: function () {
        var dom = this.refs.chartContainer.getDOMNode();
        $(dom).find('.last-chart').animate({
            left: 0
        });
    },

    hideHistory: function () {
        var dom = this.refs.chartContainer.getDOMNode();
        $(dom).find('.last-chart').animate({
            left: '119px'
        });
    },


    getNumber: function (number, d) {
        return (+number).toFixed(d || 0);
    },


    getChartData: function (type, data) {
        var me = this;
        var item = data[type];
        var result = {
            rankData: {},
            historyRankData: {}
        };

        if (type == 2 || type == 3) {
            result.rankData.axisLine = me.getAxisStyle();
            result.historyRankData.axisLine = me.getAxisStyle();
        }

        result.rankData.data = [{
            value: me.getNumber(item.rank),
            name: ''
        }];

        result.historyRankData.data = [{
            value: me.getNumber(item.historyRank),
            name: ''
        }];

        return result;
    },

    getAxisStyle: function () {
        return {
            lineStyle: {
                color: [
                    [0.5, new echarts.graphic.LinearGradient(0, 0, 0.5, 0,
                        [{
                            offset: 0,
                            color: '#c9c9c9'
                        }, {
                            offset: 1,
                            color: '#e09999'
                        }])],
                    [1, new echarts.graphic.LinearGradient(0.5, 0, 1, 0,
                        [{
                            offset: 0,
                            color: '#e09999'
                        }, {
                            offset: 1,
                            color: '#ff6565'
                        }])]
                ]
            }
        }
    }

});


module.exports = RankItem;
