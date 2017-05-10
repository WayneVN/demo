/**
 * @file 消息神器-筛选区域
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var If = require('../../component/if');
var $ = require('jquery');
var config = require('./config');
var moment = require('moment');

var itemWidth = 46;

var Filter = React.createClass({

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                category,
                dateTag,
                orderBy,
                date,
                data,
                pageMonth,
                type
            }
        } = me;

        return {
            category: category,
            dateTag: dateTag,
            date: date,
            menu: me.getMenu(dateTag),
            dateText: me.getDateText(dateTag, date),
            count: data.announcementsAllCnt,
            orderBy: orderBy,
            pageMonth: pageMonth,
            type: type
        }

    },

    componentDidMount: function () {
        var me = this;
        var element = me.refs.date.getDOMNode();
        var fromDate = new moment('2015-01-01').toDate();
        var now = new Date();
        
        $(element).daterangepicker({
            maxDuration: 365,
            selectableDateRange: {
                from: fromDate,
                to: now
            },
            selectedRange: {
                from: moment().month(0).date(1).toDate(),
                to: now
            }
        }).on('changeDate', function(event) {
            me.showPanel(true);
            var dateArr = event.date.split('-');

            me.props.setDate({
                from: moment(dateArr[0].replace(/\./g, '')).format('YYYYMMDD'),
                to: moment(dateArr[1].replace(/\./g, '')).format('YYYYMMDD')
            });
        });

        $(document).bind('click', me.clickHandler);
    },

    componentWillUnmount: function () {
        var me = this;
        $(document).unbind('click', me.clickHandler);
    },

    clickHandler: function (e) {
        var target = e.target;

        if (!($(target).hasClass('selected-date')
            || $(target).parents('.date-panel').length)
            ) {
            $('.date-panel').hide();
            $('.selected-date').removeClass('opened');
        }
    },

    getMenu: function (dateTag) {
        var me = this;
        var now = moment();
        var menu = _.cloneDeep(config.dateTag);

        for (var i = now.year(); i > 2014; i --) {
            menu.push({
                name: i + '年',
                value: i
            });
        }

        _.forEach(menu, function (item) {
            var clazz = 'date-tag-item'
            if (item.value == dateTag) {
                clazz += ' current';
            }
            item.clazz = clazz;
        });

        return menu;
    },


    getDateText: function (dateTag, date) {
        var result;

        if (dateTag) {
            _.forEach(config.dateTag, function (item) {
                if (item.value == dateTag) {
                    result = item.name;
                }
            });

            if (!result) {
                result = dateTag + '年';
            }
        }
        else {
            result = moment(date.from).format('YYYY/MM/DD') 
                + '--' 
                + moment(date.to).format('YYYY/MM/DD');
        }

        return result;
    },


    showPanel: function (isHide) {
        var me = this;
        var element = me.refs.panel.getDOMNode();

        if (!isHide) {
            $(element).show();
            $('.selected-date').addClass('opened');
        }
        else {
            $(element).hide();
            $('.selected-date').removeClass('opened');

        }
    },

    clickDateTag: function (value) {
        var me = this;

        me.showPanel(1);
        me.props.setDateTag(value);
    },


    getOrder: function (category, orderBy, type) {
        var me = this;
        var star = {
            name: '星级推荐↓',
            value: 'star',
            icon: 'fa fa-star-o'
        };
        var amount = {
            name: '金额↓',
            value: 'amount',
            icon: 'iconfont icon-rmb'
        };
        var percent = {
            name: '占股比↓',
            value: 'percent',
            icon: 'iconfont icon-percent'
        };
        var orderArr = [];

        orderArr.push(star);

        if (category == config.mergerField 
            || category == config.privateField) 
        {
            orderArr.push(amount);
        }
        else if (category == config.internalField
            && type) {
            orderArr.push(amount);
            orderArr.push(percent);
        }

        return (
            <span className="order-container">
            {
                orderArr.map(function (item) {
                    var clazz = 'order-item ';

                    if (item.value == orderBy) {
                        clazz += 'current';
                    }
                    return (
                        <span className={clazz} 
                            onClick={()=>me.clickOrder(item.value)}>
                            <i className={item.icon} />
                            {item.name}
                        </span>
                    )
                })
            }

            </span>
        )
    },

    clickOrder: function (value) {
        var me = this;
        var result = value;

        if (me.props.orderBy == value) {
            result = null;
        }

        me.props.clickOrder(result);
    },

    clickLeftArrow: function () {
        this.move(itemWidth * 6);
    },

    clickRightArrow: function () {
        this.move(-itemWidth * 6);
    },

    move: function (delta) {
        var me = this;
        var container = me.refs.pageArea.getDOMNode();
        var bar = $(container).find('.page-bar');
        var left = parseInt(bar.css('left'));
        var width = parseInt(bar.css('width'));
        var result;
        var disabled = 'disabled';

        $(container).find('.' + disabled).removeClass(disabled);
        result = left + delta;

        if (result > 0) {
            result = 0;
            $(container).find('.left-arrow').addClass(disabled);
        }
        else if (result <= -(width - itemWidth * 6)) {
            result = -(width - itemWidth * 6);
            $(container).find('.right-arrow').addClass(disabled);
        }

        bar.animate({
            left: result
        });
    },


    clickPage: function (page) {
        var me = this;
        return function () {
            me.props.setPage(page);
        }
    },

    clickMonth: function (month) {
        var me = this;
        return function () {
            me.props.setMonth(month);
        }
    },

    getMonth: function (dateTag, date) {
        var result = [];
        var now = moment();
        var startDate = moment();
        var endDate = moment();
        var temp = _.cloneDeep(date);
        var tpl = 'YYYYMMDD';
        var startMonth;
        var endMonth;

        if (dateTag == '1 month') {
            temp = {
                from: startDate.date(now.date() - 30).format(tpl),
                to: now.format(tpl)
            }
        }
        else if (dateTag == '3 month') {
            temp = {
                from: startDate.date(now.date() - 90).format(tpl),
                to: now.format(tpl)
            }
        }
        else if (typeof dateTag == 'number') {
            if (dateTag == now.year()) {
                temp = {
                    from: startDate.month(0).date(1).format(tpl),
                    to: now.format(tpl)
                }
            }
            else {
                temp = {
                    from: startDate.year(dateTag).month(0).date(1).format(tpl),
                    to: endDate.year(dateTag).month(11).date(31).format(tpl)
                }
            }
        }

        if (temp) {
            startMonth = moment(temp.from).month() + 1;
            endMonth = moment(temp.to).month() + 1;

            if (startMonth != endMonth) {

                if (endMonth < startMonth) {
                    endMonth += 12;
                }

                for (var i = endMonth; i >= startMonth; i --) {
                    result.push(i % 12 ? i % 12 : 12);
                }
            }
        }

        return result;
    },

    getPage: function (dateTag, date, pageMonth) {
        var me = this;
        var total;
        var pageArr = [];
        var width;
        var showArrow;
        var left = 0;
        var leftClazz = 'arrow-item left-arrow';
        var rightClazz = 'arrow-item right-arrow';
        var monthArr;
        var currentMonthIndex = 0;
        var barStyle;

        monthArr = me.getMonth(dateTag, date);
        pageMonth = pageMonth;
        _.forEach(monthArr, function (item, index) {
            var clazz = 'page-item';
            if (pageMonth && item == pageMonth) {
                clazz += ' current';
                currentMonthIndex = index;
            }

            pageArr.push(
                <span className={clazz} onClick={me.clickMonth(item)}>{item}月</span>
            )
        });
        width = monthArr.length * itemWidth;
        left = -itemWidth * (currentMonthIndex - 3);

        if (left > 0) {
            left = 0;
            leftClazz += ' disabled';
        }
        else if (left <= -(width - itemWidth * 6)) {
            left = -(width - itemWidth * 6);
            rightClazz += ' disabled';
        }
        
        if (pageArr.length > 6) {
            showArrow = true;
            barStyle = {
                width: width + 'px', 
                left: left + 'px',
                right: 'auto'
            }
        }
        else {
            barStyle = {
                width: width + 'px',
                right: '-10px',
                left: 'auto'
            }
        }

        $('.page-bar').css(barStyle);
        
        return (
            <span className="page-area" ref="pageArea">
                <If when={showArrow} >
                    <span onClick={me.clickLeftArrow}
                        className={leftClazz}>
                        <i className="iconfont icon-angleleft"></i>
                    </span>
                </If>
                <span className="page-container">
                    <span className="page-bar" style={barStyle}>
                    {pageArr}
                    </span>
                </span>
                <If when={showArrow} >
                    <span onClick={me.clickRightArrow}
                        className={rightClazz}>
                        <i className="iconfont icon-angleright"></i>
                    </span>
                </If>

            </span>
        )
    },

        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className='msg-filter'>
                <span onClick={()=>me.showPanel()} className="selected-date">{data.dateText}</span>
                <div className="date-panel" ref='panel'>
                <div className="date-tag-container">
                    {
                        data.menu.map(function (item) {
                            return (
                                <div className={item.clazz} onClick={()=>{me.clickDateTag(item.value)}}>{item.name}</div>
                            )
                        })
                    }
                        <div eventKey='date' className={data.date ? "date-item current" : "date-item"} ref="date">日历</div>
                    </div>
                </div>

                <span className="count-item">{data.count}条</span>

                {me.getOrder(data.category, data.orderBy, data.type)}

                {me.getPage(data.dateTag, data.date, data.pageMonth)}
            </div>
        );
    }
});

module.exports = Filter;