var React = require('react');
var echarts = require('echarts/lib/echarts');
var model = require('../../model/stockDialogModel');
var theme = require('echarts/theme/macarons');
var config = require('./config');
var _ = require('lodash');
var moment = require('moment');
var Loading = require('../../component/loading');
var logger = require('../../util/logger');
var format = require('../../util/format');
var If = require('../../component/if');
var pollController = require('../../util/pollController');

require('echarts/lib/chart/candlestick');

var K = React.createClass({

    _chart: '',

    _barChart: '',

    _pollHandlerId: '',

    _realtimeData: '',

    // 用来存画k线图使用的数据，在画k线最后一根柱子时更新此字段
    _kData: '',

    // 画成交量图的数据
    _turnover: '',

    _datazoom: '',

    // 用来控制图表刷新频率
    _flag: -1,

    getInitialState: function () {
        return {
            type:  0,
            chartData: ''
        };
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentDidMount: function () {
        var me = this;
        model.getChartData(me.props.stockId, function (error, data) {
            me.setState({
                chartData: data.data
            });
        });

        me.addPollingHandler();
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    componentWillUnmount: function () {
        var me = this;
        pollController.removeStockHandler(me._pollHandlerId);
        me._chart.dispose();
        me._barChart.dispose();
        me._chart = null;
        me._barChart = null;
    },

    componentDidUpdate: function () {
        var me = this;
        if (me._chart) {
            var option = me._chart.getOption();
            if (option) {
                me._datazoom = [option.dataZoom[0].startValue, option.dataZoom[0].endValue];
                me.renderChart(true);
            }
            else {
                me.renderChart();
            }
        } else {
            me.renderChart();
        }
    },

    addPollingHandler: function () {
        var me = this;
        var stockId = me.props.stockId;
        var option;
        me._pollHandlerId = pollController.addStockHandler([stockId], function (data) {
            me._flag ++;

            if (me._flag % 20) {
                return;
            }
            
            _.forEach(data, function (item) {
                if (item.stock_id == stockId) {
                    me._realtimeData = _.cloneDeep(item);
                }

                if (me._chart) {
                    option = me._chart.getOption();
                    if (option) {
                        me._datazoom = [option.dataZoom[0].startValue, option.dataZoom[0].endValue];
                        me.renderChart(true);
                    }
                }
            })
        });
    },

    renderChart: function (noclear) {
        var me = this;
        var element = me.refs.chart.getDOMNode();
        var barElement = me.refs.barChart.getDOMNode();
        var loading = me.refs.loading.getDOMNode();

        if (!me._chart) {
            me._chart = echarts.init(element, theme);
            me._barChart = echarts.init(barElement, theme);
        }
        
        if (me.state.chartData) {
            me.setKData();

            var option = me.getOption();
            var barOption = me.getBarOption();

            if (!noclear) {
                me._chart.clear();
                me._barChart.clear();
            }

            $(loading).hide();
            me._chart.setOption(option);


            me._barChart.setOption(barOption);

            echarts.connect([me._chart, me._barChart]);
        }
        
    },

    clickType: function (type) {
        var me = this;

        var option = me._chart.getOption();
        me._datazoom = [option.dataZoom[0].startValue, option.dataZoom[0].endValue];
        new Storage().setStore(config.stockTypeName, type);
        me._chart.dispose();
        me._chart = null;
        me.setState({
            type: type
        });

        logger.log({
            target: 'web_k_dialog_type_click',
            data: {
                type: type
            }
        });
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
                    stock_tags,
                    stamps
                }
            }
        } = me;

        return {
            type: type,
            stockTypeText: stock_tags && stock_tags.length ? stock_tags[0] : '',
        }
    },

    setKData: function () {
        var me = this;
        var {
            state: {
                type,
                chartData
            }
        } = me;
        var fieldName = config.kTypeField[type];
        var kData = _.cloneDeep(chartData[fieldName]);
        var turnover = _.cloneDeep(chartData.turnover);

        var realMoment;
        var lastMoment;

        if (me._realtimeData && me._realtimeData.tradestatus 
            && me._realtimeData.origin && me._realtimeData.origin.newprice) {
            realMoment = moment(me._realtimeData.date);
            lastMoment = moment(kData[kData.length - 1][0] + '');

            // 这个是日k的判断，如果要增加其他的k线，就要加分支
            if (realMoment.format(config.dateTPL) != lastMoment.format(config.dateTPL)) {
                me.addNewKData(kData, fieldName);
                me.addNewTurnover(turnover);
            }
        }

        me._kData = _.cloneDeep(kData);
        me._turnover = _.cloneDeep(turnover);
    },

    addNewKData: function (kData, fieldName) {
        var me = this;
        var realItem = me._realtimeData[fieldName];
        var lastItem = kData[kData.length - 1];
        kData.push([
            moment(me._realtimeData.date).format(config.dateTPL).replace(/\//g,''),
            realItem.newprice,
            realItem.open,
            realItem.high,
            realItem.low,
            (realItem.newprice - lastItem[1]).toFixed(2),
            ((realItem.newprice - lastItem[1]) / lastItem[1]).toFixed(2) * 100,
            [
                me.getMA(kData, realItem.newprice, 5),
                me.getMA(kData, realItem.newprice, 20),
                me.getMA(kData, realItem.newprice, 60),
            ]
        ])
    },

    addNewTurnover: function(result) {
        var me = this;
        var realtimeData = me._realtimeData;
        result.push([
            (moment(realtimeData.date).format(config.dateTPL)).replace(/\//g, ''),
            realtimeData.volume,
            realtimeData.amount,
            realtimeData.turnover
        ]);
    },

    getMA: function(data, newprice, day, isChange) {
        var length = data.length;
        var temp = 0;
        var result = 0;

        if (isChange) {
            length--;
        }

        if (length >= day - 1) {
            temp = +newprice;
            for (var i = length - day + 1; i < length; i ++) {
                temp += data[i][2];
            }
            result = temp / day;
        }
        else {
            for (var i = 0; i < length; i++) {
                temp += data[i][2];
            }
            result = (temp / length * (day - 1) + (+newprice)) / day;
        }

        return result;
    },

    getXAxisData: function () {
        var result = [];
        var kData = this._kData;
        var total = config.showNumber;
        var lastDate;
        var length;

        _.forEach(kData, function (item) {
            result.push(moment(item[0] + '').format('YYYY/MM/DD'));
        });
        length = result.length;
        lastDate = result[length - 1];

        if (length < config.showNumber) {

            for (var i = 1; i <= total - length; i ++) {
                var date = moment(lastDate).add(i, 'days');
                if (!date.day() || date.day() > 5) {
                    total ++;
                }
                else {
                    result.push(date.format('YYYY/MM/DD'));
                }
            }
        }

        return result;
    },

    getBarSeriesData: function () {
        var me = this;
        var result = [];
        var turnover = me._turnover || [];
        var kData = me._kData;

        _.forEach(turnover, function (item, index) {
            var color = config.red;
            if (kData[index][1] < kData[index][2]) {
                color = config.green;
            }
            else if (kData[index][3] == kData[index][4] 
                && index 
                && kData[index][1] < kData[index - 1][1]) {
                color = config.green;
            }

            result.push({
                value: item[1],
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            })
        });

        return result;
    },


    getTooltipData: function (params) {
        var time = params[0].name;
        var kData = this._kData;
        var length = kData.length;

        for (var i = 0; i < length; i ++) {
            if (moment(kData[i][0] + '').format('YYYY/MM/DD') == time) {
                return kData[i];
            }
        }
    },


    getDataZoom: function (data) {
        var me = this;
        var length = data.length;

        return {
            show : true,
            realtime: true,
            startValue: me._datazoom ? me._datazoom[0] : length - config.showNumber,
            endValue: me._datazoom ? me._datazoom[1] : length,
            dataBackgroundColor: '#D5D5ED',
            handleColor: '#696969',
            fillerColor: 'rgba(235, 235, 254, 0.5)',
            zoomLock: length <= config.showNumber,
            throttle: 500
        }
    },

    showNumber: function (date) {
        var me = this;
        var kData = me._kData;
        var volume = me._turnover;
        var kValue;
        var volumeValue;
        
        _.forEach(kData, function (item) {
            if (moment(item[0] + '').format('YYYY/MM/DD') == date) {
                kValue = item;
            }
        });

        _.forEach(volume, function (item) {
            if (moment(item[0] + '').format('YYYY/MM/DD') == date) {
                volumeValue = item;
            }
        });

        var text = '';
        var maValue = kValue[7];
        var maInfo = me.state.chartData.ma_info;

        _.forEach(maValue, function (item, index) {
            text += '<span style="color:' + config.maColor[maInfo[index]] + '">' + maInfo[index] + ':' + (+item).toFixed(3) + '</span>'
        });


        $(me.refs.maContainer.getDOMNode()).html(text);
        $(me.refs.volumeContainer.getDOMNode()).html(
            volumeValue 
            ? ''
                + '成交量：' + format.addUnit(volumeValue[1] / 100, 2) + '手 成交额：'
                + me.addUnit(volumeValue[2]) + '元 换手率：'
                + (volumeValue[3]).toFixed(2) + '%'
            : ''
        );
    },

    addUnit: function (number) {
        if (number > 10000) {
            return (number / 10000).toFixed(2) + '亿';
        }
        else {
            return number + '万';
        }
    },

    getSeries: function () {
        var me = this;
        var data = me.state.chartData;
        var seriesData = [];
        var kData = this._kData;
        var maData = [];
        var maInfo = data.ma_info;

        _.forEach(kData, function (item, index) {
            var temp = [item[2], item[1], item[4], item[3]];
            var color;

            // echart2 一字涨停板，颜色搞反了，这里加一个改回来的逻辑
            if (item[4] == item[3] && index && item[1] > kData[index - 1][1]) {
                color = config.red;
            }

            if (item[1] == item[2] && index && kData[index - 1]) {
                color = item[1] > kData[index - 1][1] ? config.red : config.green;
            }

            if (color) {
                temp = {
                    value: temp,
                    itemStyle: {
                        normal: {
                            color: color,
                            color0: color,
                            borderWidth: 1,
                            borderColor: color,
                            borderColor0: color
                        }
                    }
                }
            }
            seriesData.push(temp);

            if (item[7] && item[7].length) {
                _.forEach(item[7], function (k, j) {
                    if (!maData[j]) {
                        maData[j] = [];
                    }

                    maData[j].push(k);
                });
            }
        });

        var series = [
            {
                name:'上证指数',
                type:'k',
                barMaxWidth: 10,
                itemStyle: {
                    normal: {
                        color: config.red,
                        color0: config.green,
                        borderWidth: 1,
                        borderColor: config.red,
                        borderColor0: config.green
                    }
                },
                data: seriesData
            }
        ];

        if (kData.length < config.showNumber) {
            series.push(me.getMockSeries(kData[0][4]));
        }

        _.forEach(maData, function (item, index) {
            series.unshift({
                name: maInfo[index],
                type: 'line',
                data: item,
                symbol: 'none',
                silent: true,
                itemStyle: {
                    normal: {
                        color: config.maColor[maInfo[index]],
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            });
        });

        return series;
    },

    getMockSeries: function (value) {
        var result = [];
        for (var i = 0; i <= config.showNumber; i++) {
            result.push(value);
        }
        return {
            silent: true,
            name: Math.random(),
            type: 'line',
            showSymbol: false,
            data: result,
            hoverAnimation: false,
            lineStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)'
                },
            },
            itemStyle: {
                emphasis: {
                    opacity: 0
                }
            }
        };
    },

    getOption: function () {
        var me = this;
        var xAxisData = me.getXAxisData();
        var series = me.getSeries();
        var dataZoom = me.getDataZoom(xAxisData);
        dataZoom.show = false;

        return {
            animation: false,
            grid: {
                x: 50,
                y: 10,
                y2: 30,
                x2: 25
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var item = me.getTooltipData(params);
                    var result;
                    var time = params[0].name;

                    var style = 'style="width:60px;text-align:right;display:inline-block"';

                    if (item) {
                        result = time
                        + '<br/>  开盘价: <span ' + style + '>' + (+item[2]).toFixed(2) + '</span>'
                        + '<br/>  最高价: <span ' + style + '>' + (+item[3]).toFixed(2) + '</span>'
                        + '<br/>  最低价: <span ' + style + '>' + (+item[4]).toFixed(2) + '</span>'
                        + '<br/>  收盘价: <span ' + style + '>' + (+item[1]).toFixed(2) + '</span>'
                        + '<br/>  涨跌额: <span ' + style + '>' + (+item[5]).toFixed(2) + '</span>'
                        + '<br/>  涨跌幅: <span ' + style + '>' + (+item[6]).toFixed(2) + '%</span>';

                        me.showNumber(time);
                    }
                    else {

                        $(me.refs.volumeContainer.getDOMNode()).html('');
                        $(me.refs.maContainer.getDOMNode()).html('');
                        return;
                    }

                    return result;

                }
            },
            xAxis: [
                {
                    silent: true,
                    type : 'category',
                    boundaryGap : true,
                    axisTick: {onGap:false},
                    splitLine: {show:false},
                    data : xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#696969'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    silent: true,
                    type : 'value',
                    scale:true,
                    boundaryGap: [0.01, 0.01],
                    axisLine: {
                        lineStyle: {
                            color: '#696969'
                        }
                    },
                    axisLabel: {
                        formatter: function(value) { return value.toFixed(2); }
                    }
                }
            ],
            dataZoom: dataZoom,
            series: series
        }
    },

    getBarOption: function () {
        var me = this;
        var xAxisData = me.getXAxisData();
        var seriesData = me.getBarSeriesData();
        var dataZoom = me.getDataZoom(xAxisData);

        var option = {
            animation: false,
            grid: {
                x: 50,
                y: 0,
                x2: 25,
                y2: 45
            },
            tooltip : {
                trigger: 'axis',
                show: false
            },
            dataZoom: dataZoom,
            xAxis: [
                {
                    type : 'category',
                    boundaryGap : true,
                    axisTick: {show:false},
                    splitLine: {show:false},
                    data : xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#696969'
                        }
                    },
                    axisLabel:{show:false}
                }
            ],
            yAxis: [
                {
                    type : 'value',
                    scale: false,
                    boundaryGap: [0, 0],
                    axisLabel: {
                        show: false,
                        formatter: function (value) {
                            return format.addUnit(value);
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#696969'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'成交量',
                    type:'bar',
                    barMaxWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 1
                        }
                    },
                    data: seriesData
                }
            ]
        }

        if (seriesData.length < config.showNumber) {
            option.series.push(me.getMockSeries(seriesData[0]));
        }

        return option;
    },

    render: function () {
        var data = this.formatData();

        return (
            <div className="k-container">
                <div className="k-head">
                    <span ref="type" className="type-container">
                        <span className={!data.type ? "active k-type" : "k-type"} onClick={() => {this.clickType(0)}}>前复权</span>
                        <span className={data.type == 1 ? "active k-type" : "k-type"} onClick={() => {this.clickType(1)}}>后复权</span>
                        <span className={data.type == 2 ? "active k-type" : "k-type"} onClick={() => {this.clickType(2)}}>不复权</span>
                    </span>

                    <If when={data.stockTypeText}>
                        <span className="stock-type">{data.stockTypeText}</span>
                    </If>
                </div>

                <div className="k-chart-container">
                    <div ref="chart" className="k-chart"></div>
                    <div className="ma-number" ref="maContainer"></div>
                </div>
                <div className="bar-container">
                    <div className="volume-number" ref="volumeContainer"></div>
                    <div ref="barChart" className="bar-chart"></div>
                </div>
                <div className="loading-container">
                    <Loading ref="loading"/>
                </div>

            </div>
        );
    }
});

module.exports = K;
