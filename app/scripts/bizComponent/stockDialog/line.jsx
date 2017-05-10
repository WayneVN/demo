/**
 * @file 个股弹窗-折线图
 * @author min.chen@joudou.com
 */

var React = require('react');
var Reflux = require('reflux');
var echarts = require('echarts/lib/echarts');;
var model = require('../../model/stockDialogModel');
var theme = require('echarts/theme/macarons');
var _ = require('lodash');
var Loading = require('../../component/loading');
var If = require('../../component/if');
var $ = require('jquery');
var stockDialogStore = require('../../stores/stockDialogStore');
var moment = require('moment');
var config = require('./config');
var logger = require('../../util/logger');

require('echarts/lib/chart/line');
require('echarts/lib/component/markArea');

var Line = React.createClass({

    _chart: '',

    _barChart: '',

    _target: ['secuinfo.PE', 'secuinfo.PB', 'secuinfo.nr', 'secuinfo.ni'],

    mixins: [
        Reflux.connectFilter(stockDialogStore, 'showLine', function(option) {
            this.setState({
                type: option.type
            });
            this.getData();
        })
    ],

    getInitialState: function () {
        return {
            chartData: {},
            type: '',
            conf: {}
        };
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    getData: function () {
        var me = this;

        var element = me.refs.container.getDOMNode();
        var type = me.state.type;

        $(element).slideDown();

        model.getLineData(me.props.stockId, me.state.type, function (error, response) {
            var data = response.data || {};
            var param = {
                noData: false
            };

            logger.log({
                target: me._target[type],
                data: {
                    code: me.props.stockId
                }
            });


            if (type == 2 || type == 3) {
                param.chartData = data;
            }
            else {
                param.chartData = data.data;
                param.conf = data.conf;
                param.ltzero = data.ltzero;
            }

            me.setState(param, function () {
                me.renderChart();
            });
            
        });
    },

    renderChart: function () {
        var me = this;
        var element = me.refs.chart.getDOMNode();
        var loading = me.refs.loading.getDOMNode();
        var noData = me.refs.noData.getDOMNode();
        var type = me.state.type;
        var barElement = me.refs.grbarchart.getDOMNode();

        if (type === 0 || type == 1) {
            $(element).css('height', '443px');
            $(barElement).css('height', '1px');
            $(barElement).css('display', 'none');

            me._chart = '';
            me._chart = echarts.init(element, theme);

            me._barChart = '';
            me._barChart = echarts.init(barElement, theme);

            // if (!me._chart) {
            //     me._chart = echarts.init(element, theme);
            // }
            
            $(loading).hide();
            $(noData).hide();

            if (me.state.chartData && me.state.chartData.length) {
                var lineOption = me.getLineOption(type);

                me._chart.clear();
                me._chart.setOption(lineOption);

                me._barChart.clear();
            }
            else {
                me._chart.clear();
                $(noData).show();

                me._barChart.clear();
            }
        } else if (type == 2 || type == 3) {
            $(element).css('height', '340px');
            $(barElement).css('height', '100px');
            $(barElement).css('display', 'block');

            me._chart = '';
            me._barChart = '';
            
            me._chart = echarts.init(element, theme);
            me._barChart = echarts.init(barElement, theme);
            
            $(loading).hide();
            $(noData).hide();

            me._chart.clear();
            me._barChart.clear();
            if (me.state.chartData && me.state.chartData.length) {
                var lineOption = me.getLineOption(type);
                var barOption = me.getBarOption(type);
                me._chart.setOption(lineOption);
                me._barChart.setOption(barOption);
                echarts.connect([me._chart, me._barChart]);
            } else {
                $(noData).show();
            }
        }
    },

    formatData: function () {
        var me = this;
        var {
            state: {
                type,
                annoType
            },
            props: {
                data: {
                    stock_tags
                }
            }
        } = me;

        return {
            type: type,
            stockTypeText: stock_tags && stock_tags.length ? stock_tags[0] : ''
        }
    },


    getXAxisData: function (data, type) {
        var result = [];
        var type = this.state.type;

        _.forEach(data, function (item) {
            if (type == 2 || type == 3) {
                var temp = item[0] + '';
                result.push(temp.substr(0, 4) + 'Q' + Math.ceil(temp.substr(4) / 3));
            }
            else if (!type) {
                if (item[1]) {
                    result.push(moment(item[0] + '').format('YYYY/MM/DD'));
                }
            }
            else {
                result.push(moment(item[0] + '').format('YYYY/MM/DD'));
            }
        });

        return result;
    },

    getSeriesData: function (data, type) {
        var me = this;
        var result = [];
        var type = me.state.type;

        _.forEach(data, function (item, index) {
            if (!type) {
                if (item[2]) {
                    result.push(me.getNum(item[2], 2));
                }
            }
            else if (type == 1) {
                result.push(me.getNum(item[3], 2));
            }
            else if (type == 2 || type == 3) {
                if (index === 0) { result = [[],[]]; } // [[折线图数据], [柱状图数据]]
                // result.push(me.getNum(item[2]));
                result[0].push(me.getNum(item[2]));
                result[1].push(item[1]);
            }
        });

        return result;
    },

    getNum: function (num, fix) {
        return +((+num).toFixed(fix || 1));
    },

    formatLargeNum: function (num, digits) {
        if (typeof digits == 'undefined' ) { digits = 1; }
	if (Math.abs(num) >= 1e7) {
	    return (num / 1e8).toFixed(digits) + '亿';
	} else if (Math.abs(num) >= 1e4) {
	    return (num / 1e4).toFixed(digits) + '万';
	} else {
	    return num.toFixed(digits);
	}
    },

    getDataZoom: function (data) {
        var length = data.length;

        return {
            show : true,
            realtime: true,
            start : Math.max(0, Math.floor(100 - (700 / length * 100))),
            end : 100,
            dataBackgroundColor: '#D5D5ED',
            handleColor: '#696969',
            fillerColor: 'rgba(235, 235, 254, 0.5)',
            throttle: 500
        }
    },


    getLineOption: function (type) {
        var me = this;
        var {
            state: {
                type,
                chartData
            }
        } = me;

        var _data = _.cloneDeep(chartData);
        var xAxisData = me.getXAxisData(_data);
        var seriesData = me.getSeriesData(_data);
        var dataZoom = me.getDataZoom(xAxisData);
        var axisLabel = me.getAxisLabel(type);

        dataZoom.show = false;

        if (type === 0 || type == 1) {
            seriesData = [seriesData, []];
            dataZoom.show = true;
        }

        return {
            grid: {
                x: (type === 0 || type == 1) ? 60 : 50,
                y: 10,
                x2: (type === 0 || type == 1) ? 50 : 30,
                y2: (type === 0 || type == 1) ? 60 : 25
            },
            dataZoom : dataZoom,
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function (params) {
                    if (type == 2 || type == 3) {
                        return params[0].name + '<br/>'
                            + params[0].seriesName + ": " + params[0].value.toFixed(1) + '%<br/>'
                        // + params[1].seriesName + ": " + me.formatLargeNum(params[1].value, 1);
                            + me.getName(type, 1) + ": "
                            + me.formatLargeNum(seriesData[1][params[0].dataIndex], 1);
                    } else {
                        var item = params[0];
                        var text;

                        if (!type) {
                            _.forEach(_data, function (dataItem) {
                                if (dataItem[0] == item.name.replace(/\//g, '')) {
                                    text = dataItem[1].toFixed(2);
                                }
                            })
                        }
                        else {
                            text = item.value.toFixed(2);
                        }

                        return item.seriesName + '<br/>'
                            + item.name + ': ' + text;
                    }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    show: true,
                    boundaryGap : true,
                    axisTick: {
                        show: false,
                        onGap:false
                    },
                    splitLine: {show:false},
                    data : xAxisData,
                    axisLine: {
                        show: (type == 2 || type == 3) ? true : false,
                        lineStyle: {
                            color: '#696969',
                            type: 'dotted'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale: !type,
                    min: !type ? 0 : 'auto',
                    // max: !type ? Math.max.apply(me, me.state.ltzero || []): 'auto',
                    boundaryGap: [0.01, 0.01],
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#696969'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: !!type
                    },
                    axisLabel: me.getAxisLabel(type, 0)
                },
                {
                    type: 'value',
                    scale: false,
                    show: false,
                    boundaryGap: [0.01, 0.01],
                    axisLabel: me.getAxisLabel(type, 1),
                    axisLine: {
                        show: seriesData[1].length > 0,
                        lineStyle: {
                            color: '#696969'
                        }
                    },
                    axisLabel: {
                        show: seriesData[1].length > 0,
                        formatter: function(obj) {
                            return me.formatLargeNum(obj, 1);
                        }
                    },
                    axisTick: {
                        show: seriesData[1].length > 0
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series : [
                {
                    name: me.getName(type, 0),
                    type:'line',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: seriesData[0],
                    smooth: false,
                    symbol: 'none',
                    showSymbol: true,
                    showAllSymbol: false,
                    itemStyle: {
                        normal: {
                            color: '#284a7d',
                            label: {
                                show: !!type,
                                formatter: function(value) {
                                    return value.data+'%';
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: false
                            }
                        }
                    },
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        label: {
                            normal: {
                                formatter: function (a) {
                                    return a.name;
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#696969',
                                type: 'dotted'
                            }
                        },
                        data: me.getMarkLineData(type)
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            normal: {
                                color: 'rgba(200,200,200,0.5)',
                                borderWidth: 0,
                                borderType: 'dashed'
                            }
                        },
                        data: me.getMarkAreaData(type)
                    }
                },
                // {
                //     name: me.getName(type, 1),
                //     type: 'bar',
                //     xAxisIndex: 0,
                //     yAxisIndex: 1,
                //     data: seriesData[1],
                //     symbol: 'none',
                //     showSymbol: true,
                //     showAllSymbol: false,
                //     itemStyle: {
                //         normal: {
                //             color: 'rgba(255, 171, 54, .7)',
                //         },
                //         emphasis: {
                //             label: {
                //                 position: 'top',
                //                 show: false,
                //                 formatter: function(value) {
                //                     return me.formatLargeNum(value.data, 1);
                //                 },
                //                 textStyle: {
                //                     color: '#666'
                //                 }
                //             }
                //         }
                //     }
                // }
            ]
        }
    },

    getBarOption: function(type) {
        var me = this;
        var {
            state: {
                type,
                chartData
            }
        } = me;
        var _data = _.cloneDeep(chartData);
        var xAxisData = me.getXAxisData(_data);
        var seriesData = me.getSeriesData(_data);
        var dataZoom = me.getDataZoom(xAxisData);
        var axisLabel = me.getAxisLabel(type);
        return {
            grid: {
                x: 50,
                y: 0,
                x2: 25,
                y2: 45
            },
            tooltip: {
                trigger: 'axis',
                show: false
            },
            dataZoom : dataZoom,
            xAxis: {
                type : 'category',
                show: true,
                boundaryGap : true,
                axisTick: {
                    show: false,
                    onGap:false
                },
                splitLine: {show:false},
                data : xAxisData,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#696969',
                        type: 'dotted'
                    }
                },
                axisLabel: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                scale: false,
                // show: false,
                boundaryGap: [0.01, 0.01],
                axisLabel: me.getAxisLabel(type, 1),
                axisLine: {
                    show: seriesData[1].length > 0,
                    lineStyle: {
                        color: '#696969'
                    }
                },
                splitNumber: 5,
                axisLabel: {
                    show: false,
                    formatter: function(obj) {
                        return me.formatLargeNum(obj, 1);
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true
                }
            },
            series: {
                name: me.getName(type, 1),
                type: 'bar',
                barMinHeight: 5,
                data: seriesData[1],
                symbol: 'none',
                showSymbol: true,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: 'rgba(255, 171, 54, .7)',
                    },
                    emphasis: {
                        label: {
                            position: 'top',
                            show: false,
                            formatter: function(value) {
                                return me.formatLargeNum(value.data, 1);
                            },
                            textStyle: {
                                color: '#666'
                            }
                        }
                    }
                }
            }
        }
    },

    getMarkLineData: function (type) {
        var me = this;
        var result = [];
        var conf = me.state.conf;

        if (!type) {
            _.forEach(conf, function (item) {
                result.push({
                    yAxis: item[0],
                    name: item[1]
                });
            });
        }

        return result;
    },

    getMarkAreaData: function (type) {
        var me = this;
        var result = [];
        var ltzero = me.state.ltzero;

        if (!type) {
            result.push([{
                yAxis: ltzero[0]
            }, {
                yAxis: ltzero[1]
            }]);
        }

        return result;
    },

    getAxisLabel: function (type, index) {
        var result = {};

        if (index == 0 && (type == 2 || type == 3) ) {
            result.formatter = function (value) {
                return value + '%';
            }
        } else {
            result.formatter = function (value) {
                return value.toFixed(2);
            }
        }

        result.show = !!type;

        return result;
    },

    getName: function (type, index) {
        var result = '';
        if (type == 2 || type == 3) {
            result = config.rankTypeNames[type][index];
        } else {
            result = config.rankTypeNames[type];
        }
        return result;
    },

    clickType: function (type) {
        var me = this;

        me.setState({
            type: type
        }, function () {

            if (type == 2 || type == 3) {
                me.getData();
            }
            else {
                me.renderChart();
            }
        })
    },

    back: function () {
        var me = this;

        var element = me.refs.container.getDOMNode();

        $(element).slideUp();
    },

    render: function () {
        var data = this.formatData();
        var type = this.state.type;

        return (
            <div className="line-container" ref="container">
                <div className="line-head">
                    <span ref="type" className="type-container">
                        <If when={!type || type == 1}>
                        <span>
                            <span className={!type ? "active k-type" : "k-type"} onClick={() => {this.clickType(0)}}>PE</span>
                            <span className={type == 1 ? "active k-type" : "k-type"} onClick={() => {this.clickType(1)}}>PB</span>
                        </span>
                        </If>

                        <If when={type == 2 || type == 3}>
                        <span>
                            <span className={type == 2 ? "active k-type" : "k-type"} onClick={() => {this.clickType(2)}}>净利增速</span>
                            <span className={type == 3 ? "active k-type" : "k-type"} onClick={() => {this.clickType(3)}}>营收增速</span>
                        </span>
                        </If>
                    </span>

                    <span className="back" onClick={this.back}>回k线图</span>
                    <If when={data.stockTypeText}>
                        <span className="stock-type">{data.stockTypeText}</span>
                    </If>
                </div>
                <div className="line-chart-container">
                    <div ref="chart" className="line-chart"></div>
                    <div ref="grbarchart" className="bar-chart"></div>
                </div>
                <div className="loading-container">
                    <Loading ref="loading"/>
                </div>
                <div ref="noData" className="no-data">暂无数据</div>
            </div>
        );
    }
});

module.exports = Line;
