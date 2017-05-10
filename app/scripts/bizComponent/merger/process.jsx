/**
 * @file 并购-动画
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var config = require('./config');
var format = require('../../util/format');
var $ = require('jquery');
var If = require('../../component/if');
var Tooltip = require('rc-tooltip');
var echarts = require('echarts/lib/echarts');

var Process = React.createClass({

    _chart: '',

    _moving: false,
    _status: 'before',

    getInitialState: function () {
        return {
            key: +new Date()
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

    componentDidUpdate: function () {
        this.renderChart();
    },

    renderChart: function () {
        var me = this;
        var data = me.formatData();
        var element;

        if (data.isBackdoor) {
            return;
        }

        me._chart = '';

        if (!me._chart) {
            element = me.refs.chart.getDOMNode();

            me._chart = echarts.init(element);
        }

        var option = me.getOption();

        me._chart.clear();
        me._chart.setOption(option);
    },

    getOption: function () {
        var me = this;
        var data = me.formatData();
        var series = {
            name: '并购',
            type: 'pie',
            radius :[30, 45],
            center: ['50%', '50%'],
            silent: true,
            labelLine: {
                normal: {
                    show: false
                }
            },
            itemStyle : {
                normal : {
                    label : {
                        show : false
                    }
                },
            }
        };
        var seriesData = [];

        _.forEach(data.jiaban.acquired.marketValue, function (item) {
            seriesData.push(item.marketValue);
        });


        series.data = seriesData;

        return {
            color: ['#2dabdd', '#0e8cd8', '#116bd9', '#1a47ba', '#242d91'],
            series: [series]
        }
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    growth: {
                        type,
                        PE,
                        GR,
                        PEG,
                        data,
                        declaredMonth,

                        marketValue,
                        assets,
                        PB,
                        acquiring,
                        acquired,
                        year,
                        impactText
                    },
                    impact: {
                        impactValueGrowth
                    },
                    process: {
                        before,
                        after
                    },
                    overview,
                    meta
                }
            },
            state: {
                key
            }
        } = this;

        return {
            type: type,
            pe: PE,
            gr: GR,
            peg: PEG,
            data: me.getBlockData(data, declaredMonth),

            // growth 用到的数据
            marketValue: marketValue,
            assets: assets,
            pb: PB,
            acquiring: acquiring,
            acquired: acquired,
            year: year,

            score: impactValueGrowth.value,
            grade: impactValueGrowth.level,

            jiaban: before,
            overview: overview,
            meta: meta,

            value1: before.acquiring.marketValue,
            value2: before.inc.stockAmount,
            value3: after.marketValue,

            key: key,
            isBackdoor: meta.isBackdoor,
            impactText: impactText,
            shortType: !before.fund || !before.fund.amount,
            onlyCash: !before.inc.stockNum

        }
    },

    getBlockData: function (data, declaredMonth) {
        if (data && data.length) {
            var max = data[0].value;
            var width = 72; //Math.round(600 / (data.length || 1) - 15);
            var delta = (960 - (width + 25) * data.length) / 2;

            _.forEach(data, function (item) {
                if (Math.abs(item.value) > max) {
                    max = Math.abs(item.value);
                }
            });

            _.forEach(data, function (item, index) {
                var height = Math.ceil(Math.abs(item.value / max) * config.blockHeight);

                item.blockStyle = {
                    height: height + 'px',
                    'background-color': config.color[item.type] || config.color.historical
                };

                if (item.type == 'current') {
                    item.blockStyle = {
                        height: height + 'px',
                        'background-color': config.color.commitment
                    };
                }

                item.containerStyle = {
                    width: width + 'px',
                    left: (width + 25) * index + delta
                }
            });
        }

        return data;
    },


    showTip: function (isHide) {
        var me = this;

        return function (e) {
            var element = me.refs.tip.getDOMNode();
            
            if (!isHide) {
                me.setTop(element, e);
            }

            $(element).animate({
                right: isHide ? -300 : 400
            }, {
                queue: false
            });
        }
    },

    setTop: function (element, e) {
        if (e.clientY > 430) {
            $(element).css('top', '-150px');
        }
        else {
            $(element).css('top', '0');
        }
    },


    getGrade: function (data) {
        var me = this;
        var type = data.type;
        var grade = config['grade' + type];

        return (
            <div ref="tip" className={"grade-tip grade-tip-growth grade-tip-" + data.grade}>
                <div className="color-line">{config.typeText[type]}指数 {format.ajustFix(data.score)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>{type}</td>
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
        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (
            <div className="process-container" ref="container"
                key={data.key}>  

                <div className='content-box process-box'>
                    <div className="name"><span>并购过程</span></div>       
                    {me.getJiaBan(data)}
                </div>
                
                {me.getGrowth(data)}
            </div>
        );
    },


    getGrowth: function (data) {
        var me = this;
        return (
            <div className='content-box growth-box'>
                <div className="name"><span>估值评级</span></div>
                <If when={data.type == 'PEG'}>
                    {me.getFunc2(data)}
                </If>

                {me.getGrade(data)}
                
                {me.getCode(data)}

                {me.getBlock(data)}

                {me.getLegend(data)}
            </div>
        )
    },

    getCode: function (data) {
        var me = this;
        var type = data.type;

        if (type == 'PEG') {
            return (

                <div className="code-container">
                    <div className="code-name">PEG</div>
                    <div>
                        <span>= PE/(GR*100)</span>
                        <If when={typeof data.grade == 'number'}>
                        <span className="color-text right"
                            onMouseEnter={me.showTip()} onMouseLeave={me.showTip(true)}>
                            <span>评级:{config.gradeText[data.grade]}</span>
                            <span className="qa-mark">?</span>
                        </span>
                        </If>
                    </div>
                    <div>= {format.ajustFix(data.pe)}/({format.percent(data.gr, 1)}*100)</div>
                    <div>= {data.gr <= 0 ? '-' : format.ajustFix(data.peg)}</div>

                    <If when={data.impactText}>
                        <div className="impact-text">{data.impactText}</div>
                    </If>
                </div>

            )
        }
        else {
            return (

                <div className="code-container">
                    <div className="code-name">PB</div>
                    <div>
                        <span>= 市值/净资产</span>
                        <If when={typeof data.grade == 'number'}>
                        <span className="color-text right"
                            onMouseEnter={me.showTip()} onMouseLeave={me.showTip(true)}>
                            <span>评级:{config.gradeText[data.grade]}</span>
                            <span className="qa-mark">?</span>
                        </span>
                        </If>
                    </div>
                    <div>= {format.addWan(data.marketValue)}/{format.addWan(data.assets)}</div>
                    <div>= {format.ajustFix(data.pb)}</div>

                    <If when={data.impactText}>
                        <div className="impact-text">{data.impactText}</div>
                    </If>

                </div>
            )
        }
        
    },

    getBlock: function (data) {
        var me = this;

        // if (data.type == 'PEG') {
            return (
                <div className="block-container">
                    {
                        data.data.map(function (item) {
                            if (item.value < 0) {
                                return (
                                    <div>
                                        <div className={"block-item negative " + item.type}
                                            style={item.containerStyle}>
                                                <div className="value" data-value={item.value}>{format.addWan(item.value)}</div>
                                                <div className="color-block" style={item.blockStyle}></div>
                                        </div>
                                        <div className="block-label" 
                                            style={{left: item.containerStyle.left}}>{item.label}</div>
                                    </div>
                                )
                            }

                            if (item.value >= 0) {
                                return (
                                    <div>
                                        <div className={"block-item positive " + item.type} 
                                            style={item.containerStyle}>
                                            <div className="value" data-value={item.value}>{format.addWan(item.value)}</div>
                                            <div className="color-block" style={item.blockStyle}></div>
                                        </div>

                                        <div className="block-label" 
                                            style={{left: item.containerStyle.left}}>{item.label}</div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            )
        // }
        // else {
        //     var total = data.acquiring + data.acquired;
        //     var height1 = Math.round(data.acquiring / total * config.blockHeight) + 'px';
        //     var height2 = Math.round(data.acquired / total * config.blockHeight) + 'px';

        //     return (
        //         <div className="block-container type-pb">
        //             <div className="block-item acquiring" data-value={data.acquiring}>
        //                 <div className="value">{format.addWan(data.acquiring)}</div>
        //                 <div className="color-block" style={{height: height1}}></div>
        //             </div>

        //             <div className="block-item current">
        //                 <div className="block-label">{data.year}</div>
        //             </div>

        //             <div className="block-item acquired" data-value={data.acquired}>
        //                 <div className="value">{format.addWan(data.acquired)}</div>
        //                 <div className="color-block" style={{height: height2}}></div>
        //             </div>
        //         </div>
        //     )
        // }
        
    },


    getLegend: function (data) {
        var me = this;

        // if (data.type == 'PEG') {
            return (
                <div className="legend-container">
                    <span className="before">
                        <span className="ltm legend-item">收购方近12个月净利润（LTM)</span>
                        <span className="future legend-item">被收购方承诺/预测净利润</span>
                        <span className="history legend-item">被收购方历史净利润</span>
                    </span>

                    <span className="after">
                        <span className="ltm legend-item">收购方近12个月净利润（LTM)</span>
                        <span className="after legend-item">并购后预期净利润</span>
                    </span>
                </div>
            )
        // }
        // else {
        //     return (
        //         <div className="legend-container">
        //             <span className="legend-acquiring legend-item">收购方净资产</span>
        //             <span className="legend-acquired legend-item">被收购方净资产</span>
        //         </div>
        //     )
        // }
    },

    getJiaBan: function (data) {
        var me = this;
        var fund = data.jiaban.fund;
        var inc = data.jiaban.inc;
        var acquired = data.jiaban.acquired;
        var acquiring = data.jiaban.acquiring;
        var fundMembers = data.jiaban.fundMembers;
        var clazz = data.shortType ? 'short-type' : '';
        var clazz8 = '';
        var clazz7 = '';

        if (!inc.cash) {
            clazz8 += ' no-cash';
        }
        if (!inc.stockNum) {
            clazz8 += ' no-stock';
        }

        if (parseFloat(format.addYi(data.value1)) < parseFloat(format.addYi(acquired.marketValueAmount))) {
            clazz7 = 'small';
        }
        else if (parseFloat(format.addYi(data.value1)) == parseFloat(format.addYi(acquired.marketValueAmount))) {
            clazz7 = 'same';
        }

        return (
            <div className={"jiaban-container " + clazz}>
                <div className="jiaban-toggle">
                    <div>
                        <span className="current">并购前</span>
                        <span className="right">并购后</span>
                    </div>
                    <div className="toggle-container" onClick={me.toggleMove}>
                        <div className="toggle-bar"></div>
                    </div>
                </div>

                <div className="jiaban-box">
                    <If when={!data.shortType}>
                    <div className="jiaban-1">
                        <div className="jiaban-text">配募价:{fund && (+fund.stockPrice).toFixed(2)}</div>
                        <Tooltip placement="bottom" overlay={<span>配募方认购上市公司的股份，每股的价格</span>}>
                            <div className='jiaban-text-1'>
                                什么是配募价？
                            </div>
                        </Tooltip>
                    </div>
                    </If>

                    <div className="jiaban-2" 
                        onMouseEnter={me.show('tip1', '', 'tip6')} 
                        onMouseLeave={me.show('tip1', true, 'tip6')}>
                        <div><i className="iconfont icon-role"></i></div>
                        <div className="text">收购方股东</div>
                    </div>

                    <If when={!data.onlyCash}>
                    <div className="jiaban-3">
                        <div className="jiaban-text">换股价:{(+inc.stockPrice).toFixed(2)}</div>
                        <Tooltip placement="bottom" overlay={<span>上市公司发行股份收购公司时，每股的价格</span>}>
                            <div className='jiaban-text-1'>
                                什么是换股价？
                            </div>
                        </Tooltip>
                    </div>
                    </If>

                    <div className="jiaban-4" 
                        onMouseEnter={me.show('tip2', '', 'tip6')} 
                        onMouseLeave={me.show('tip2', true, 'tip6')}>
                        <div><i className="iconfont icon-role"></i></div>
                        <div className="text">被收购方股东</div>
                    </div>

                    <If when={!data.shortType}>
                        <div className="jiaban-5"
                            onMouseEnter={me.show('tip3', '', 'tip6')} 
                            onMouseLeave={me.show('tip3', true, 'tip6')}>
                            <div><i className="iconfont icon-role"></i></div>
                            <div className="text">配募方</div>
                        </div>
                    </If>

                    <If when={!data.shortType}>
                        <div className="jiaban-6">
                            <div className="icon-div"><i className="iconfont icon-money1"></i></div>
                            <div>认购{format.addWan(fund && fund.stockNum)}股</div>
                            <div>兑价¥{format.addYi(fund && fund.amount)}</div>
                        </div>
                    </If>

                    <div className={"jiaban-7 " + clazz7}>
                        <div>{acquiring.name}</div>
                        <div className="value">{format.addYi(data.value1)}</div>
                    </div>

                    <div className={"jiaban-8 " + clazz8}
                        onMouseEnter={me.show('tip4')} 
                        onMouseLeave={me.show('tip4', true)}>

                        <If when={inc.cash}>
                            <div className="cash-container">
                                <div>¥{format.addYi(inc.cash)}</div>
                                <div className="icon-div"><i className="iconfont icon-money1"></i></div>
                            </div>
                        </If>

                        <If when={inc.stockNum}>
                            <div>
                                <div className="stock-container">
                                    <div className="icon-div"><i className="iconfont icon-stock"></i></div>
                                </div>
                                <div className="text-div">
                                    <div>{format.addWan(inc.stockNum)}股</div>
                                    <div>兑价¥{format.addYi(inc.stockAmount)}</div>
                                </div>
                            </div>
                        </If>
                    </div>

                    <If when={!data.isBackdoor}>
                        <div className="jiaban-9"
                            onMouseEnter={me.show('tip5')} 
                            onMouseLeave={me.show('tip5', true)}>
                            <div className="chart" ref="chart"></div>
                            <div className="text-container">
                                <div>被收购方</div>
                                <div>{format.addYi(acquired.marketValueAmount)}</div>
                            </div>
                        </div>
                    </If>
                    
                    <If when={data.isBackdoor}>
                        <div className="jiaban-9 backdoor"
                            onMouseEnter={me.show('tip5')} 
                            onMouseLeave={me.show('tip5', true)}>
                            <div>{acquired.name}</div>
                            <div className="value">{format.addYi(acquired.marketValueAmount)}</div>
                        </div>
                    </If>

                    <If when={!data.shortType}>
                    <div className="line-group-1">
                        <div className="line-1"></div>
                        <div className="line-2"></div>
                        <div className="line-3"></div>
                    </div>
                    </If>

                    <div className="line-group-2">
                        <If when={!data.onlyCash}>
                        <div className="line-4"></div>
                        </If>
                        <div className="line-5"></div>
                        <div className="line-6"></div>
                    </div>

                    {me.getTip1(acquiring)}
                    {me.getTip2(acquired)}
                    <If when={!data.shortType && fundMembers && fundMembers.length}>
                        {me.getTip3(fundMembers)}
                    </If>

                    <If when={inc.cash && inc.cashStockholders && inc.cashStockholders.length}>
                        {me.getTip4(inc)}
                    </If>
                    {me.getTip5(acquired, inc, data.meta)}


                    {me.getTip6(data)}

                </div>
                
                {me.getFunc1(data)}

                <div className="jiaban-warning">
                    <div>*以上市值均按照上市公司今日收盘价计算</div>
                    <div>（收盘价更新时间为每日16：10）</div>
                </div>

            </div>
        )

    },

    getTip1: function (acquiring) {
        var me = this;
        var list = [];

        _.forEach(acquiring.stockholders, function (item) {
            list.push({
                name: item.name,
                value: format.percent(item.ratio, 2)
            });
        });

        return me.getTip(list, acquiring.name, 'jiaban-tip-1', 'tip1');
    },    

    getTip2: function (acquired) {
        var me = this;
        var temp = [];
        var clazz = acquired.stockholders.length == 5 ? 'member-5' : '';

        _.forEach(acquired.stockholders, function (item, index) {
            var list = [];

            _.forEach(item.stockholders, function (k) {
                list.push({
                    name: k.name,
                    value: k.ratio
                });
            });

            temp.push(me.getTip(list, item.name, 'jiaban-tip-2-' + index, 'tip2-' + index));
        });

        return (
            <div className={"jiaban-tip-group " + clazz} ref="tip2">
                {temp}
            </div>
        )
    },    

    getTip3: function (fundMembers) {
        var me = this;
        var list = [];

        _.forEach(fundMembers, function (item) {
            list.push({
                name: item.name,
                value: '认购金额' + format.addYi(item.amount)
            });

            list.push({
                name: '',
                value: '认购股份' + format.addWan(item.stock)
            });
        });

        return me.getTip(list, '资金募集方', 'jiaban-tip-3', 'tip3');
    },    

    getTip4: function (inc) {
        var me = this;
        var list = [];

        _.forEach(inc.cashStockholders, function (item) {
            list.push({
                name: item.name,
                value: item.cash >= 10000000 ? format.addYi(item.cash) : format.addWan(item.cash)
            });
        });

        return me.getTip(list, '拿现金的股东', 
            'jiaban-tip-4', 'tip4');
    },    

    getTip5: function (acquired, inc, meta) {
        var me = this;
        var list = [];
        var text = '';

        _.forEach(acquired.marketValue, function (item) {
            list.push({
                name: item.name,
                value: format.addYi(item.marketValue)
            });
        });

        if (inc.stockNum) {
            text = '* ' + format.addYi(acquired.marketValueAmount) + ' = ' 
                + format.addWan(inc.stockNum) + ' * ' + (+meta.price).toFixed(2);

            if (inc.cash) {
                text += ' <span class="blank-span"> + ' + format.addWan(inc.cash) + '</span>';
            }
        }

        return me.getTip(list, format.addYi(acquired.marketValueAmount) + '市值', 
            'jiaban-tip-5', 'tip5', text);
    },

    getTip6: function (data) {
        var me = this;
        var list = [];

        _.forEach(data.overview.after.stockholders, function (item) {
            list.push({
                name: item.name,
                value: format.percent(item.ratio, 2)
            });
        });

        return me.getTip(list, '股东', 'jiaban-tip-6', 'tip6');
    },

    show: function (ref, isHide, specialRef) {
        var me = this;
        return function () {
            var element;
            var refElement = me.refs[ref];

            if (me._status == 'after' && specialRef) {
                refElement = me.refs[specialRef];
            }

            if (!refElement) {
                return;
            }

            element = refElement.getDOMNode();

            if (me._moving && me._status != 'before') {
                return;
            }

            if (isHide) {
                $(element).hide();
            }
            else {
                $(element).prop('style', false).show();
                $(element).find('jiaban-tip').prop('style', false);
            }
        }
    },

    getTip: function (list, text, clazz, ref, text1) {
        return (
            <div ref={ref} className={"grade-tip jiaban-tip " + clazz}>
                <div className="color-line">{text}</div>
                <table>
                    <tbody>                          
                        {
                            list.map(function (item) {
                                return (
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.value}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                <div className="extra-text" dangerouslySetInnerHTML={{__html: text1}}></div>
            </div>
        )
    },

    getFunc1: function (data) {
        var fundamentals = data.overview.after.fundamentals;

        // if (data.type == 'PEG') {
            return (
                <div className="func1">
                    <span>合并后的PE =</span>
                    <span className="right">= {format.ajustFix(fundamentals.PE)}</span>

                    <span className="market-value">
                        {format.addWan(fundamentals.marketValue)}
                    </span>

                    <span className="net-income">
                        {format.addWan(fundamentals.netIncome)}
                    </span>
                </div>
            )
        // }
        // else {
        //     return (
        //         <div className="func1">
        //             <span>合并后的PB =</span>
        //             <span className="right">= {format.ajustFix(data.pb)}</span>

        //             <span className="market-value">
        //                 {format.addWan(data.marketValue)}
        //             </span>

        //             <span className="net-income">
        //                 {format.addWan(data.assets)}
        //             </span>
        //         </div>
        //     )
        // }
        
    },

    getFunc2: function (data) {
        var me = this;
        var year;
        var index;
        var index2;
        var flag = false;
        var year2;
        var ltm;

        if (!data.data || !data.data.length) {
            return;
        }
        
        _.forEach(data.data, function (item, i) {
            if (item.type == 'LTM') {
                ltm = item.value;
            }
            if (item.type == 'current') {
                index = i + 1;
                year = data.data[index] && (+data.data[index].label);
            }
        });

        if (data.data[index + 2]) {
            index2 = index + 2;
            flag = true;
        }
        else {
            index2 = index + 1;
        }

        if (!data.data[index2]) {
            return (<span></span>)
        }

        year2 = data.data[index2].label;


        return (
            <div className="func2">
                <span>GR={'{'}(</span>
                <span className="blank-span">/</span>
                <span>)</span>
                <If when={flag}>
                    <span>^(1/2)</span>
                </If>
                <span>-1}*100%={format.percent(data.gr, 1)}</span>
                <span className="text">* {year}至{year2}年复合增速</span>
                <span className="number1">{format.addCommas(Math.round((data.data[index2].value + ltm) / 10000))}</span>
                <span className="number2">{format.addCommas(Math.round((data.data[index].value + ltm) / 10000))}</span>
            </div>
        )
    },

    toggleMove: function () {
        var me = this;

        if (me._moving) {
            return;
        }

        if (me._status == 'before') {
            me.startMove();
        }
        else {
            me.reset();
        }
    },

    reset: function () {
        var me = this;
        me._status = 'before';
        me.setState({
            key: +new Date()
        });
    },


    startMove: function () {
        var me = this;
        var data = me.formatData();
        var container = me.refs.container.getDOMNode();

        me._status = 'after';
        me._moving = true;

        me.step1($(container));
    },

    moveHandler: function (container, element, type, deltaX, deltaY, callback, time) {
        var me = this;
        var temp;
        var i = 0;
        var top = parseFloat(element.css('top')); 
        var left;
        var right;
        var ratio;
        var obj;

        if (type == 'left') {
            left = parseFloat(element.css('left'));
        } 
        else {
            right = parseFloat(element.css('right'));
        }

        setTimeout(function () {
            temp = setInterval(function () {
                i++;

                if (i > config.moveTime / 25) {
                    clearInterval(temp);

                    callback(container);
                }
                else {
                    var ratio = i / (config.moveTime / 25);
                    var obj = {
                        transform: 'scale(' + (1 - ratio) + ',' + (1 - ratio) + ')',
                        top: (top - deltaY) * (1 - ratio) + deltaY
                    }

                    if (type == 'left') {
                        obj.left = (left - deltaX) * (1 - ratio) + deltaX;
                    }
                    else {
                        obj.right = (right - deltaX) * (1 - ratio) + deltaX;
                    }

                    element.css(obj);
                }
            }, 25);
        }, time || config.showTime);
    },

    step1: function (container) {
        var me = this;
        var element = container.find('.jiaban-toggle');
        element.find('.toggle-container').addClass('active');

        $('body').animate({
            'scrollTop': container.find('.process-box').prop('offsetTop') 
                - $('.description-box').prop('offsetTop')
        }, 200, 'linear', function () {
            element.find('.toggle-bar').animate({
                left: 49
            }, config.moveTime, 'linear', function () {
                element.find('.toggle-container').removeClass('active');
                element.find('.current').removeClass('current');
                element.find('.right').addClass('current');
                me.step2(container);
                // me.growStep1(container);
            });
        });
    },

    step2: function (container) {
        var me = this;
        var element = container.find('.jiaban-tip-1');
        element.prop('style', false).show();

        me.moveHandler(container, element, 'left', 380, -element.height() / 2, 
            function (container) {
                me.step3(container);
            }
        )
    },

    step3: function (container) {
        var me = this;
        var element = container.find('.jiaban-tip-4');

        if (element.length) {
            element.prop('style', false).show();

            me.moveHandler(container, element, 'right', 145, 120 - element.height() / 2, 
                function (container) {
                    me.step4(container);
                }
            );
        }
        else {
            me.step4(container);
        }
        
    },

    step4: function (container) {
        var me = this;
        var element = container.find('.jiaban-8');
        element.prop('style', false).show();

        setTimeout(function () {

            container.find('.jiaban-3').fadeOut(200);
            setTimeout(function () {
                container.find('.line-group-2').hide();

                me.moveHandler(container, element, 'right', 0, 0,
                    function (container) {
                        setTimeout(function () {
                            me.step5(container);
                        }, 2000);
                    }, 1000
                );
            }, 200);
        }, 1000);
    },

    step5: function (container) {
        var me = this;
        var element = container.find('.jiaban-tip-5');
        element.prop('style', false).show();

        me.moveHandler(container, element, 'right', -50, 120 - element.height() / 2, 
            function (container) {
                me.step6(container);
            }
        );
    },

    step6: function (container) {
        var me = this;
        var element = container.find('.jiaban-9');
        var circle = container.find('.jiaban-7');
        var data = me.formatData();
        var tempDom = circle;
        var otherDom = element;

        if (data.onlyCash) {
            setTimeout(function () {
                element.animate({
                    left: 435
                }, config.moveTime, 'linear', function () {
                    element.hide();
                    me.step7(container);
                });
            }, 1000);
            return;
        }

        setTimeout(function () {
            element.animate({
                left: 435
            }, config.moveTime, 'linear', function () {
                var value = data.value1 + data.value2;
                if (data.isBackdoor) {
                    tempDom = element;
                    otherDom = circle;
                }

                if (data.shortType) {
                    value = data.value3;
                }

                otherDom.hide();
                tempDom.find('.value').text(format.addYi(value));

                tempDom.animate({
                    width: 130,
                    height: 130,
                    top: 72,
                    left: 406,
                    'padding-top': 27,
                    'font-size': 18
                }, 1000, 'linear', function () {
                    me.step7(container);
                });
            });
        }, 1000);
    },


    step7: function (container) {
        var me = this;
        var element = container.find('.jiaban-tip-group');

        element.prop('style', false).show();

        var list = element.find('.jiaban-tip');

        me.step7child(container, list, list.length - 1);
    },

    step7child: function (container, list, index) {
        var me = this;
        var element = $(list[index]);
        var temp;
        var i = 0;
        var data = me.formatData();
        
        temp = setInterval(function () {
            i ++;
            if (i < 10) {
                var value = 1 + i * 0.01;
                element.css({
                    transform: 'scale(1,' + value + ')'
                });
            }
            else {
                clearInterval(temp);
                me.moveHandler(container, element, 'right', -50, -element.height() / 2,
                    function (container) {
                        index--;
                        if (index < 0) {
                            if (data.onlyCash) {
                                me.cashStep1(container, data);
                            }
                            else {
                                me.step8(container);
                            }
                        }
                        else {
                            me.step7child(container, list, index);
                        }
                    }
                );
            }
            element.css
        }, 25);
        
    },

    cashStep1: function (container, data) {
        var me = this;
        container.find('.jiaban-9').fadeOut();
        container.find('.jiaban-4').fadeOut();

        container.find('.jiaban-2 .text').text('并购后股东');

        if (!data.shortType) {
            me.step9(container);
        }
        else {
            me.pbStep1(container);
        }
    },


    step8: function (container) {
        var me = this;
        var element = container.find('.jiaban-4');
        var data = me.formatData();

        if (!data.isBackdoor) {
            element.find('.text').hide();

            element.animate({
                left: 490
            }, 500, 'linear', function () {
                if (data.shortType) {
                    me.pbStep1(container);
                }
                else {
                    me.step9(container);
                }
            });
        }
        else {
            container.find('.jiaban-2').fadeOut();
            element.find('.text').hide();

            element.animate({
                left: 432
            }, 500, 'linear', function () {
                element.find('.text').text('并购后股东').show();

                if (data.shortType) {
                    me.pbStep1(container);
                }
                else {
                    me.step9(container);
                }
            });
        }
        
    },

    pbStep1: function (container) {
        var me = this;
        var element = container.find('.jiaban-box');

        element.animate({
            left: 0
        }, 1000, 'linear', function () {
            me.startGrowth(container);
        });
    },

    step9: function (container) {
        var me = this;
        var element = container.find('.jiaban-1');

        setTimeout(function () {
            container.find('.line-group-1').hide();
            element.fadeOut(200, function () {
                me.step12(container);
            })
        }, 1000);
        
    },

    step10: function (container) {
        var me = this;
        var element = container.find('.jiaban-tip-3');

        if (element.length) {
            element.prop('style', false).show();

            me.moveHandler(container, element, 'left', -100, 120 - element.height() / 2, 
                function (container) {
                    me.step11(container);
                }
            );
        }
        else {
            me.step11(container);
        }
        
    },

    

    step11: function (container) {
        var me = this;
        var element = container.find('.jiaban-5');

        element.find('.text').hide();

        element.animate({
            top: 0,
            left: 410
        }, 500, 'linear', function () {
            container.find('.jiaban-2').find('.text').text('并购后股东');

            setTimeout(function () {
                me.startGrowth(container);
            }, 2000);
        })
    },

    step12: function (container) {
        var me = this;
        var element = container.find('.jiaban-6');
        var circle = container.find('.jiaban-7');
        var data = me.formatData();

        element.animate({
            left: 400
        }, 1000, 'linear', function () {
            element.hide();

            circle.find('.value').text(
                format.addYi(data.value3));

            circle.animate({
                width: 150,
                height: 150,
                top: 62,
                left: 396,
                'padding-top': 37,
                'font-size': 20
            }, 100, 'linear', function () {
                setTimeout(function () {
                    me.step10(container);
                }, 2000);
            });
        })
    },

    startGrowth: function (container) {
        var me = this;
        var data = me.formatData();

        $('body').animate({
            'scrollTop': container.find('.growth-box').prop('offsetTop') 
                - $('.description-box').prop('offsetTop') - 100
        }, 200, 'linear', function () {
            // if (data.type == 'PEG') {
            //     me.growStep1(container);
            // }
            // else {
            //     me.pbStep2(container);
            // }

            if (me.hasCommitment(data) || me.hasCurrent(data)) {
                me.growStep1(container);
            }
            else {
                me.growStep4(container, true);
            }
        });
    },

    hasCommitment: function (data) {
        return this.hasDataType(data, 'commitment');
    },

    hasCurrent: function (data) {
        return this.hasDataType(data, 'current');
    },

    hasDataType: function (data, type) {
        var flag = false;
        _.forEach(data.data || [], function (item) {
            if (item.type == type) {
                flag = true;
            }
        });

        return flag;
    },

    pbStep2: function (container) {
        var me = this;
        var acquired = container.find('.block-item.acquired');
        var acquiring = container.find('.block-item.acquiring');
        var height = acquired.find('.color-block').height();
        var bottom = parseFloat(acquiring.css('bottom'));
        var left = parseFloat(container.find('.block-item.current').css('left'));

        acquiring.find('.value').hide();
        acquired.find('.value').hide();

        acquiring.animate({
            bottom: bottom + height,
            left: left
        }, 1000, 'linear', function () {
            acquired.animate({
                left: left
            }, 1000, 'linear', function () {
                acquiring.find('.value').text(
                    format.addWan(acquiring.data('value') + acquired.data('value'))
                ).fadeIn();

                me.pbStep3(container);
            });
        });

    },

    pbStep3: function (container) {
        var me = this;
        var element = $('<div class="current-merger"><div class="text">合并后</div><div class="text">净资产之和</div><div class="border-block"></div></div>');
        var current = container.find('.block-item.current');
        var acquiring = container.find('.block-item.acquiring');
        var bottom = parseFloat(current.css('bottom')) - 5;
        var height = parseFloat(acquiring.css('bottom')) - bottom + acquiring.height() + 5;

        element.css({
            position: 'absolute',
            left: parseFloat(current.css('left')) - 5,
            bottom: 0,
            textAlign: 'center'
        });

        element.find('.border-block').css({
            width: parseFloat(current.css('width')) + 10,
            height: height + 10,
            border: '1px solid #666'
        });

        element.find('.text').hide();

        element.appendTo('.block-container');

        element.animate({
            bottom: bottom
        }, 200, 'linear', function () {
            element.find('.text').fadeIn();
            me.growStep4(container);
        });
    },

    growStep1: function (container) {
        var me = this;
        var element = container.find('.block-item.historical');

        element.find('.value').fadeOut();
        element.find('.color-block').fadeOut(1000);

        setTimeout(function () {
            me.growStep2(container);
        }, 1000);
        
    },

    getLTMCopy: function (container) {
        
        var clone = container.find('.LTM').clone();

        clone.removeClass('LTM').addClass('LTM-clone').attr('data-reactid', false);
        clone.appendTo('.block-container');

        return clone;
    },

    growStep2: function (container) {
        var me = this;
        var clone = me.getLTMCopy(container);
        var left = parseFloat(container.find('.block-item.current').css('left'));

        clone.find('.value').css('visibility', 'hidden');
        clone.addClass('clone-current').animate({
            left: left
        }, 1000, 'linear', function () {
            me.growStep3(container);
        });
    },

    growStep3: function (container) {
        var me = this;
        var element = $('<div class="current-merger"><div class="text">合并后</div><div class="text">净利润之和</div><div class="text value"></div><div class="border-block"></div></div>');
        var current = container.find('.block-item.current');
        var ltm = container.find('.block-item.LTM');
        var currentHeight = parseFloat(current.css('height'));
        var ltmHeight = parseFloat(ltm.css('height'));
        var height;
        var bottom;

        if (current.hasClass('negative') && ltm.hasClass('negative')) {
            height = Math.max(ltmHeight, currentHeight);
            bottom = 145 - height - 5;
        }
        else if (current.hasClass('positive') && ltm.hasClass('positive')) {
            height = Math.max(ltmHeight, currentHeight);
            bottom = 140;
        }
        else if (current.hasClass('positive')) {
            height = ltmHeight + currentHeight;
            bottom = 145 - ltmHeight - 5;
        }
        else {
            height = ltmHeight + currentHeight;
            bottom = 145 - currentHeight - 5;
        }

        element.find('.value').html(
            format.addWan(current.find('.value').data('value') + ltm.find('.value').data('value'))
        );

        element.css({
            position: 'absolute',
            left: parseFloat(current.css('left')) - 5,
            bottom: 0,
            textAlign: 'center'
        });

        element.find('.text').hide();
        element.find('.border-block').css({
            width: parseFloat(current.css('width')) + 10,
            height: height + 10,
            border: '1px solid #666'
        });

        element.appendTo('.block-container');

        element.animate({
            bottom: bottom
        }, 1000, 'linear', function () {
            element.find('.text').fadeIn();
            current.find('.value').css('visibility', 'hidden');
            me.growStep4(container);
        });
    },


    growStep4: function (container, isOver) {
        var me = this;
        var element = container.find('.func1');
        var current = container.find('.block-item.current');
        var data = me.formatData();

        container.find('.growth-box .name').fadeOut();
        element.animate({
            left: 300
        }, 200, 'linear', function () {
            element.find('.market-value').show().animate({
                top: -16
            }, 200);

            element.find('.net-income')
            // .css({
            //     left: parseFloat(current.css('left')),
            //     top: 150 + parseFloat(current.prop('offsetLeft'))
            // })
            .show().animate({
                left: 136,
                top: 16
            }, 200, 'linear', function () {
                element.find('.right').fadeIn();

                if (isOver) {
                    me.over(container);
                    return;
                }
                // if (data.type == 'PEG') {
                setTimeout(function () {
                    me.growStep5(container);                    
                }, 2000);
                // }
                // else {
                //     me._moving = false;
                // }
            })
        });
    },


    growStep5: function (container) {
        var me = this;
        var list = container.find('.block-item.commitment');
        var i = 0;

        me.moveClone(container, list, i);

    },

    moveClone: function (container, list, index) {
        var me = this;
        var clone = me.getLTMCopy(container);
        var element = $(list[index]);

        clone.find('.value').css('visibility', 'hidden');
        
        clone.addClass('clone' + index).animate({
            left: parseFloat(element.css('left'))
        }, 1000, 'linear', function () {
            index ++;
            if (index < list.length) {
                me.moveClone(container, list, index);
            }
            else {
                me.growStep6(container, list);
            }
            
        });
    },

    growStep6: function (container, list) {
        var me = this;

        list.each(function (index, item) {
            var element = $(item);
            var clone = container.find('.clone' + index);
            me.merger(container, clone, element);
        });

        me.merger(container, container.find('.clone-current'), 
            container.find('.current'));
        container.find('.current-merger').hide();

        setTimeout(function () {
            me.growStep7(container);
        }, 3000);
    },

    getColorBlockHeight: function (element) {
        var height = 0;
        element.find('.color-block').each(function (index, item) {
            height += $(item).height();
        });

        return height;
    },

    merger: function (container, clone, element) {
        var me = this;
        var height = me.getColorBlockHeight(element);
        var bottom = parseFloat(clone.css('bottom'));
        var top = parseFloat(clone.css('top'));
        var cloneHeight = clone.find('.color-block').height();

        clone.find('.value').css('visibility', 'hidden');
        element.find('.value').css('visibility', 'hidden');

        if (clone.hasClass('positive') && element.hasClass('positive')) {
            clone.animate({
                bottom: bottom + height
            }, 1000, 'linear', function () {
                me.merger1(element, height + cloneHeight, clone);
            })
        }
        else if (clone.hasClass('negative') && element.hasClass('negative')) {
            clone.animate({
                top: top + height
            }, 1000, 'linear', function () {
                me.merger1(element, height + cloneHeight, clone);
            })
        }
        else if (clone.hasClass('positive') && element.hasClass('negative')) {
            if (cloneHeight <= height) {
                clone.animate({
                    bottom: bottom - cloneHeight
                }, 1000, 'linear', function () {
                    me.merger2(element, height, cloneHeight, clone, 'bottom');
                })
            }
            else {
                element.css('z-index', 10).animate({
                    top: parseFloat(element.css('top')) - height,
                    zIndex: 10
                }, 1000, 'linear', function () {
                    me.merger2(clone, cloneHeight, height, element, 'top');
                })
            }
            
        }
        else if (clone.hasClass('negative') && element.hasClass('positive')) {
            if (cloneHeight <= height) {
                clone.animate({
                    top: top - cloneHeight
                }, 1000, 'linear', function () {
                    me.merger2(element, height, cloneHeight, clone, 'top');
                })
            }
            else {
                element.css('z-index', 10).animate({
                    bottom: parseFloat(element.css('bottom')) - height
                }, 1000, 'linear', function () {
                    me.merger2(clone, cloneHeight, height, element, 'bottom');
                })
            }
        } 
    },

    merger1: function (element, height, clone) {
        setTimeout(function () {
            element.find('.color-block').hide();
            element.find('.color-block').eq(0).css({
                height: height,
                'background-color': config.color.after
            }).show();

            clone.hide();
            var value = element.find('.value');

            value.text(
                format.addWan(value.data('value') + clone.find('.value').data('value'))
            ).css('visibility', 'visible');
        }, 1000);
    },

    merger2: function (element, height, cloneHeight, clone, type) {
        var finalHeight = Math.abs(height - cloneHeight);
        var style;
        var finalStyle = {};

        setTimeout(function () {
            element.find('.color-block').hide();
            style = {
                height: finalHeight,
                'background-color': config.color.after,
                position: 'relative'
            };

            style[type] = -Math.min(height, cloneHeight);
            element.find('.color-block').eq(0).css(style).show();

            if (height >= cloneHeight) {
                finalStyle[type] = 0;
            }
            else {
                finalStyle[type] = finalHeight;
            }

            element.find('.color-block').animate(finalStyle, 1000, 'linear', function () {
                var value = element.find('.value');
                var style = {
                    position: 'relative'
                };

                if (height < cloneHeight) {
                    style[type] = finalHeight;
                    value.css(style);
                }

                value.text(
                    format.addWan(value.data('value') + clone.find('.value').data('value'))
                ).css('visibility', 'visible');

            });

            clone.hide();
        }, 1000);
    },

    growStep7: function (container) {
        var me = this;
        var element = container.find('.func2');

        element.animate({
            left: 300
        }, 1000, 'linear', function () {
            element.find('.number1').css('top', -100).show().animate({
                top: 0
            });

            element.find('.number2').css('top', 100).show().animate({
                top: 0
            });

            me.over(container);
        });

        if (!element.length) {
            me.over(container);
        }
    },

    over: function (container) {
        var me = this;
        var legend = container.find('.legend-container');

        legend.find('.before').hide();
        legend.find('.after').show();

        // container.find('.current-merger').hide();

        setTimeout(function () {
            me._moving = false;
        }, 1000);
    }
});

module.exports = Process;