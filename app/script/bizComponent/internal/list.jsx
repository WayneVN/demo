/**
 * @file 内部交易-评级
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var config = require('./config');
var _ = require('lodash');
var Tooltip = require('rc-tooltip');
var moment = require('moment');

var List = React.createClass({

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
                    event,
                    serial_events
                }
            }
        } = this;
        
        return {
            list: me.getList(serial_events, event),
            eventType: event.event_type,
            scoreMoney: serial_events.score_amount,
            scoreRatio: serial_events.score_ratio,
            gradeMoney: serial_events.level_amount,
            gradeRatio: serial_events.level_ratio,
            gradePrice: serial_events.level_price,
            scorePrice: serial_events.score_price,
            serialEvents: serial_events || {},
            priceCategory: event.price_category,
            isFake: serial_events && serial_events.plan_item && serial_events.plan_item.is_fake,
            isOver: serial_events && (!serial_events.sub_item || !serial_events.sub_item.length) && serial_events.parent_item.status == 3
        }
    },

    getList: function (serialEvents, event) {
        var me = this;
        var list = [];
        var total = serialEvents.parent_item.progress;
        var leave = total;

        list.push(
            me.getItem(
                serialEvents.parent_item, total, leave, serialEvents, 1, event.id
            )
        );

        if (serialEvents.sub_item.length != 1) {
            _.forEach(serialEvents.sub_item, function (item) {
                list.push(
                    me.getItem(
                        item, total, leave, serialEvents, 0, event.id
                    )
                );
                leave -= item.progress;
            });
        }
        return list;
    },


    getItem: function (data, total, leave, serialEvents, isParent, id) {
        var me = this;
        var clazz = '';
        var subItem = serialEvents.sub_item;

        if (isParent) {

            if (
                (data.status != 1) 
                && !(data.status == 3 && (!subItem || !subItem.length))
            ) {
                clazz = 'strong-line';
            }
        }

        return (
            <tr className={clazz}>
                <td className="circle-item">{me.getCircle(data, isParent, id, serialEvents)}</td>
                <td className="status-item">{me.getStatus(data, isParent, serialEvents)}</td>
                <td className="date-item">{me.getDate(data)}</td>
                <td className="money-item">{me.getMoney(data, isParent)}</td>
                <td>{me.getMoneyGrade(data, serialEvents, isParent)}</td>
                <td className="ratio-item">{me.getRatio(data, isParent)}</td>
                <td>{me.getRatioGrade(data, serialEvents, isParent)}</td>
                <td className="cost-item">{me.getCost(data, isParent)}</td>
                <td>{me.getCostGrade(isParent)}</td>
                <td className="progress-item">{me.getProgress(data, total, leave, isParent)}</td>
                <td className="announcment-item">{me.getAnnouncment(data)}</td>
            </tr>
        )
    },

    getCircle: function (data, isParent, id, serialEvents) {
        var me = this;
        var clazz;
        var isCurrent;
        var subItem = serialEvents.sub_item;
        if (!isParent) {
            clazz = 'list-circle ';

            if (data.status == 1) {
                clazz += 'circle-start';
            }
            else if (data.status == 3) {
                clazz += 'circle-end';
            }
            else {
                clazz += 'circle-evolve';
            }

            if (data.event_id == id) {
                clazz += ' current';
                isCurrent = true;
            }

            if (subItem.length == 1) {
                clazz += ' only-one';
            }

            if (subItem[subItem.length - 1].event_id == data.event_id) {
                clazz += ' last-one';
            }

            if (subItem[0].event_id == data.event_id) {
                clazz += ' first-one';
            }
        }
        else {
            if (data.status == 3 && (!subItem || !subItem.length)) {
                clazz = 'list-circle only-one circle-end current';
            }
        }

        return (
            <span className={clazz}>
                <If when={isCurrent}>
                    <Tooltip placement="top" overlay={<span>本次</span>}>
                        <span className='big-circle'>
                            <span className="small-circle"></span>
                        </span>
                    </Tooltip>
                </If>
                <If when={!isCurrent}>
                    <span className='big-circle'>
                        <span className="small-circle"></span>
                    </span>
                </If>
                
            </span>
        )
    },

    getStatus: function (data, isParent, serialEvents) {
        var me = this;
        var text = '';
        var clazz = '';
        var statusMap = me.props.data.status_map;
        var subItem = serialEvents.sub_item;

        if (isParent && serialEvents.sub_item.length != 1) {

            if (data.status == 1) {
                text = '计划';
            }
            else if (data.status == 3 && (!subItem || !subItem.length)) {
                text = '结束';
            }
            else {
                text = '累计';
                clazz = 'red-status';
            }
        }
        else {
            text = statusMap[data.status];

            if (data.status == 2 && 
                subItem[subItem.length - 1].event_id == data.event_id) {
                text = '开始';
            }

        }

        return (
            <span className={clazz}>
                {text}
            </span>
        )
    },

    getDate: function (data) {
        if (data.trade_start_date && data.trade_end_date 
            && data.trade_start_date != data.trade_end_date) {
            return (
                <span>
                    {moment(data.trade_start_date + '').format('YYYY/MM/DD')}
                    -
                    {moment(data.trade_end_date + '').format('YYYY/MM/DD')}
                </span>
            )
        }
        else {
            return (
                <span>
                    {moment((data.trade_start_date || data.trade_end_date) + '').format('YYYY/MM/DD')}                    
                </span>
            )
        }
    },

    getMoney: function (data, isParent) {
        var clazz = isParent ? 'list-money-span' : '';

        return (
            <span className={clazz}>
                {format.addWan(format.ajustEmpty(data.amount))}
            </span>
        )
    },

    getMoneyGrade: function (data, serialEvents, isParent) {
        var me = this;
        return (
            <If when={isParent && typeof serialEvents.score_amount == 'number' && serialEvents.level_amount != -1 && serialEvents.score != -1}>
                <span className="color-text grade-text" 
                    onMouseEnter={me.showTipMoney} onMouseLeave={me.hideTipMoney}>
                    <span>{config.gradeText[serialEvents.level_amount]}</span>
                    <span className="qa-mark">?</span>
                </span>
            </If>
        )
    },

    getRatio: function (data, isParent) {
        var clazz = isParent ? 'list-ratio-span' : '';
        var fix = 2;
        var ratio = data.share_ratio;
        var result;

        if (!ratio || !(+ratio)) {
            result = '-';
        }
        else {
            while (+ratio && !result) {
                fix ++;
                result = Math.floor(ratio * Math.pow(10, fix));
            };    
            result = format.percent(ratio, Math.max(fix - 2, 2));
        }
        

        return (
            <span className={clazz}>
                {result}
            </span>
        )
    },

    getRatioGrade: function (data, serialEvents, isParent) {
        var me = this;

        return (
            <If when={isParent && typeof serialEvents.score_ratio == 'number' && serialEvents.level_ratio != -1 && serialEvents.score != -1}>
                <span className="color-text grade-text"
                    onMouseEnter={me.showTipRatio} onMouseLeave={me.hideTipRatio}>
                    <span>{config.gradeText[serialEvents.level_ratio]}</span>
                    <span className="qa-mark">?</span>
                </span>
            </If>
        )
    },

    getCost: function (data, isParent) {
        var clazz = isParent ? 'list-price-span' : '';
        return (
            <span className={clazz}>
                {(+data.cost) ? (+data.cost).toFixed(2) : '-'}
            </span>
        )
    },

    getCostGrade: function (isParent) {
        var me = this;
        var data = me.props.data || {};
        var text = config.priceCategory[data.event && data.event.price_category];

        return (
            <If when={isParent && text}>
                <span>({text})</span>
            </If>
        )

        // return (
        //     <If when={isParent && typeof serialEvents.score_price == 'number' && serialEvents.level_price != -1 && serialEvents.score != -1}>
        //         <span className="color-text grade-text"
        //             onMouseEnter={me.showTipCost} onMouseLeave={me.hideTipCost}>
        //             <span>{config.gradeText[serialEvents.level_price]}</span>
        //             <span className="qa-mark">?</span>
        //         </span>
        //     </If>
        // )
    },

    getProgress: function (data, total, leave, isParent) {
        var progress = data.progress || 0;
        var value = format.percent(progress, 1);
        var width = progress / total * config.progressWidth;
        var padding = (leave - progress) / total * config.progressWidth;
        var noData = isParent && !(+progress);

        width = Math.max(width, 3);

        return (
            <span>
                <If when={!noData}>
                    <span className="progress-container" style={{'padding-left': Math.round(padding) + 'px'}}>
                        <span className="list-progress-bar" style={{width: width + 'px'}}></span>
                        <If when={!isParent || progress <= 1}>
                            <span>{value}</span>
                        </If>

                        <If when={isParent && progress > 1}>
                            <Tooltip placement="top" overlay={<span>{value}</span>}>
                                <span>>100%</span>
                            </Tooltip>
                        </If>
                    </span>
                </If>

                <If when={noData}>
                    <span className="no-data-progress">{value}</span>
                </If>
            </span>
        )
    },

    getAnnouncment: function (data) {
        return (
            <span>
                <span>{moment(data.publish_date).format('YYYY/MM/DD')}</span>
                <If when={data.announcement_url}>
                    <a target="_blank" href={data.announcement_url}>
                        <img className="pdf-icon" src="/images/pdf.png" />
                    </a>
                </If>

                <If when={!data.announcement_url}>
                    <img className="pdf-icon hide-icon" src="/images/pdf.png" />
                </If>

            </span>
        )
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

    move: function (type, right) {
        var me = this;
        var element = me.refs[type].getDOMNode();

        $(element).animate({
            right: right
        }, {
            queue: false
        });
    },

    showTipMoney: function () {
        this.move('tipMoney', 365);
    },

    showTipRatio: function () {
        this.move('tipRatio', 210);
    },

    hideTipMoney: function () {
        this.move('tipMoney', -200);
    },

    hideTipRatio: function () {
        this.move('tipRatio', -200);
    },

    showTipCost: function () {
        this.move('tipCost', 170);
    },

    hideTipCost: function () {
        this.move('tipCost', -200);
    },

    getTipMoney: function (data) {
        var me = this;
        var grade = config.gradeMoney1;
        if (data.eventType == 5) {
            grade = config.gradeMoney2;
        }

        return (
            <div ref="tipMoney" className={"grade-tip grade-tip-money grade-tip-" + data.gradeMoney}>
                <div className="color-line">金额指数 {format.ajustFix(data.scoreMoney)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>金额</td>
                        </tr>                            
                        {me.getGradeList(grade)}
                    </tbody>

                </table>
            </div>
        )
    },


    getTipRatio: function (data) {
        var me = this;
        var grade = config.gradeRatio1;
        if (data.eventType == 5) {
            grade = config.gradeRatio2;
        }

        return (
            <div ref="tipRatio" className={"grade-tip grade-tip-ratio grade-tip-" + data.gradeRatio}>
                <div className="color-line">占股比指数 {format.ajustFix(data.scoreRatio)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>占股比</td>
                        </tr>                            
                        {me.getGradeList(grade)}
                    </tbody>

                </table>
            </div>
        )
    },


    getTipCost: function (data) {
        var me = this;
        var grade = config.gradePrice;

        return (
            <div ref="tipCost" className={"grade-tip grade-tip-cost grade-tip-" + data.gradePrice}>
                <div className="color-line">价格指数 {format.ajustFix(data.scorePrice)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>价格比</td>
                        </tr>                            
                        {me.getGradeList(grade)}
                    </tbody>

                </table>
            </div>
        )
    },


    getOriginText: function (data) {
        var planItem = data.serialEvents.plan_item || {};
        var text = '计划';
        var temp = [];

        text += config.actionText[data.eventType];

        if (+planItem.amount_origin) {
            temp.push('总额' + format.addWan(planItem.amount_origin));
        }

        if (+planItem.share_ratio_origin) {
            temp.push('占股比' + format.percent(+planItem.share_ratio_origin, 2));
        }

        text += temp.join('，');

        return text;
    },
        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className="internal-dialog-list">
                <table className="list-table">
                    <thead>
                        <tr className="table-head">
                            <td></td>
                            <td></td>
                            <td>时间</td>
                            <td>金额</td>
                            <td></td>
                            <td>占股比</td>
                            <td></td>
                            <td>均价</td>
                            <td></td>
                            <td className="special-td">
                                对比<span className="color-text">计划</span>完成度
                                <If when={!data.isFake}>
                                <Tooltip placement="top" overlay={<span>{me.getOriginText(data)}</span>}>
                                    <div className="qa-mark">?</div>
                                </Tooltip>
                                </If>
                            </td>
                            <td>公告</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.list.map(function (item) {
                                return item;
                            })
                        }
                    </tbody>
                </table>

                <div className="tip-container">
                    <div className="tip-item">注：均价均为按现价复权后的价格。</div>
                </div>
                {me.getTipMoney(data)}

                {me.getTipRatio(data)}

                {me.getTipCost(data)}
            </div>
        );
    }
});

module.exports = List;