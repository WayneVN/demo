/**
 * @file 仪表盘
 * @author min.chen@joudou.com
 */

var React = require('react');
var echarts = require('echarts/lib/echarts');;
var theme = require('echarts/theme/macarons');
var zrColor = require('zrender/src/tool/color');
var $ = require('jquery');
require('echarts/lib/chart/gauge');

var Gauge = React.createClass({
    getDefaultProps: function() {
      return {
        renderAsImage: true
      };
    },

    _chart: '',

    getInitialState: function () {
        return {
            data: {},
            clazz: ''
        };
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentDidMount: function () {
        this.renderChart();
    },

    componentDidUpdate: function () {
        this.renderChart();
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    renderChart: function () {
        var me = this;
        var element = me.refs.chart.getDOMNode();

        if (!me._chart) {
            me._chart = echarts.init(element, theme);
        }

        var option = me.getOption(this.state.data);
        me._chart.setOption(option, true);
    },

    getOption: function (data) {
        var option = {
            renderAsImage: this.props.renderAsImage,
            series : [
                {
                    name:'业务指标',
                    type:'gauge',
                    splitNumber: 0,
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                      lineStyle: {
                        color: [
                            [0.5, new echarts.graphic.LinearGradient(0, 0, 0.5, 0,
                                [{
                                    offset: 0, 
                                    color:'#c9c9c9'
                                }, {
                                    offset:1, 
                                    color: '#a8a8c4'
                                }])],
                            [1, new echarts.graphic.LinearGradient(0.5, 0, 1, 0,
                                [{
                                    offset: 0, 
                                    color: '#a8a8c4'
                                }, {
                                    offset: 1, 
                                    color: '#8585be'
                                }])]

                        ],
                        width: 15
                      }
                    },
                    axisLabel: {
                        show: false
                    },
                    center: ['50%', 70],
                    radius: 40,
                    startAngle: 180,
                    endAngle: 0,
                    pointer : {
                        width : 5
                    },
                    // todo 对应内容的展示
                    // detail: {
                    //     // backgroundColor: '#000',
                    //     // width: 40,
                    //     // height: 20,
                    //     offsetCenter: [0, -75],
                    //     formatter: function (value) {
                    //         return value + '%';
                    //     },
                    //     textStyle: {
                    //         fontSize: 22
                    //     }
                    // },
                    data:[{value: 50, name: 'test'}]
                }
            ]
        };

        data = data || {};

        $.extend(true, option.series[0], data);
        return option;
    },

    render: function () {
        var clazz = this.state.clazz || '';
        var className = 'gauge-chart ' + clazz;

        return (
            <div ref="chart" className={className}>

            </div>
        );
    }
});

module.exports = Gauge;
