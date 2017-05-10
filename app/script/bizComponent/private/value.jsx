/**
 * @file 定增弹窗-估值评级
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var config = require('./config');
var If = require('../../component/if');
var format = require('../../util/format');

var Value = React.createClass({

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
                    valuation_rating,
                    score_PE,
                    score_PB,
                    level_pe,
                    level_pb,
                    is_hot_industry
                }
            }
        } = this;
        var result = [];
        var score;
        var grade;
        var text;


        _.forEach(['major_biz', 'market_value', 'net_income', 'PE', 'PB'], function (item) {
            var temp = {
                text: config.name[item],
                before: me.getFixedNumber(valuation_rating.before[item], item),
                after: me.getFixedNumber(valuation_rating.after[item], item),
                clazz: ''//'right-number'
            };

            if (item == 'major_biz') {
                temp.before = valuation_rating.before[item];
                temp.after = valuation_rating.after[item];
                temp.clazz = '';
            }

            result.push(temp);
        });

        if (score_PE >= score_PB && valuation_rating.after.PE > 0) {
            result[3].grade = level_pe;
            score = score_PE;
            grade = level_pe;
            text = 'PE';
        }
        else {
            result[4].grade = level_pb;
            score = score_PB;
            grade = level_pb;
            text = 'PB';
        }

        return {
            result: result,
            score: format.ajustFix(score),
            grade: grade,
            text: text,
            isHot: +is_hot_industry 
        }
    },

    getFixedNumber: function (number, item) {
        var fix = 1;
        number = +number;
        var result;

        if (typeof number != 'number') {
            return number;
        }

        if (Math.abs(number) >= 10) {
            fix = 0;
        }

        if (item == 'net_income') {
            result = format.addWan(number);
        }
        else if (item == 'market_value') {
            result = format.addYi(number);
        }
        else {
            result = format.ajustFix(number);
        }
        return result;
    },


    showTip: function (e) {
        this.setTop(e);
        this.move(20);
    },

    setTop: function (e) {
        var element = $(this.refs.tip.getDOMNode());
        var scrollTop = $('body').prop('scrollTop');
        var index = $('.content-box.value tr').index($(e.target).parents('tr'));

        if (e.clientY > 460) {
            element.css('top', index * 31 + 45 - 190 + 'px');
        }
        else {
            element.css('top', (index + 1) * 31 + 45 + 'px');
        }
    },

    hideTip: function () {
        this.move(-200);
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

        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className='content-box value'>
                <div className="name"><span>估值评级</span></div>

                <div className="text-line">
                    <span>估值变化</span>
                    <span className="right">*取PE/PB评级较高者</span>
                </div>
                <table className="my-table">
                    <tbody>
                        <tr>
                            <td></td>
                            <td>定增前</td>
                            <td>定增后</td>
                            <td>评级</td>
                        </tr>
                    {
                        data.result.map(function (item) {
                            return (
                                <tr>
                                    <td>{item.text}</td>
                                    <td className={item.clazz}>{item.before}</td>
                                    <td className={item.clazz}>{item.after}</td>
                                    <td>
                                        <If when={item.grade !== undefined}>
                                            <span>
                                                <span>{config.gradeText[item.grade]}</span>
                                                <span className="qa-mark" onMouseEnter={me.showTip} onMouseLeave={me.hideTip}>?</span>
                                            </span>
                                        </If>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>


                <div ref="tip" className={"grade-tip grade-tip-" + data.grade}>
                    <div className="color-line">基本面指数 {data.score}</div>
                    <table>
                        <If when={data.text == 'PE' && data.isHot}>
                            <tbody>
                                <tr>
                                    <td>评级</td>
                                    <td>增发后的PE</td>
                                </tr>                            
                                <tr className="tip-0">
                                    <td>高</td>
                                    <td>(0, 25]</td>
                                </tr>                            
                                <tr className="tip-1">
                                    <td>较高</td>
                                    <td>(25, 40]</td>
                                </tr>                            
                                <tr className="tip-2">
                                    <td>中</td>
                                    <td>(40, 50]</td>
                                </tr>                            
                                <tr className="tip-3">
                                    <td>低</td>
                                    <td>大于50</td>
                                </tr>
                            </tbody>
                        </If>
                        
                        <If when={data.text == 'PE' && !data.isHot}>
                            <tbody>
                                <tr>
                                    <td>评级</td>
                                    <td>增发后的PE</td>
                                </tr>                            
                                <tr className="tip-0">
                                    <td>高</td>
                                    <td>(0, 10]</td>
                                </tr>                            
                                <tr className="tip-1">
                                    <td>较高</td>
                                    <td>(10, 20]</td>
                                </tr>                            
                                <tr className="tip-2">
                                    <td>中</td>
                                    <td>(20, 25]</td>
                                </tr>                            
                                <tr className="tip-3">
                                    <td>低</td>
                                    <td>大于25</td>
                                </tr>
                            </tbody>
                        </If>
                        
                        <If when={data.text == 'PB'}>
                            <tbody>
                                <tr>
                                    <td>评级</td>
                                    <td>增发后的PB</td>
                                </tr>                            
                                <tr className="tip-0">
                                    <td>高</td>
                                    <td>(0, 0.8]</td>
                                </tr>                            
                                <tr className="tip-1">
                                    <td>较高</td>
                                    <td>(0.8, 1.1]</td>
                                </tr>                            
                                <tr className="tip-2">
                                    <td>中</td>
                                    <td>(1.1, 2]</td>
                                </tr>                            
                                <tr className="tip-3">
                                    <td>低</td>
                                    <td>大于2</td>
                                </tr>
                            </tbody>
                        </If>


                    </table>
                </div>
            </div>
        );
    }
});

module.exports = Value;
