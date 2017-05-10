/**
 * @file 并购-事件描述
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var config = require('./config');
var format = require('../../util/format');
var $ = require('jquery');
var If = require('../../component/if');

var Description = React.createClass({

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
                    description: {
                        acquiringConcept,
                        acquiredConcept,
                        description
                    },
                    impact: {
                        impactValueConcept
                    }
                }
            }
        } = this;

        return {
            acquiring: acquiringConcept,
            acquired: acquiredConcept,
            description: description,

            score: impactValueConcept.value,
            grade: impactValueConcept.level
        }
    },


    showTip: function (isHide) {
        var me = this;

        return function () {
            var element = me.refs.tip.getDOMNode();

            $(element).animate({
                right: isHide ? -300 : 0
            }, {
                queue: false
            });
        }
    },


    getGrade: function (data) {
        var me = this;
        var grade = config.gradeConcept;

        return (
            <div ref="tip" className={"grade-tip grade-tip-concept grade-tip-" + data.grade}>
                <div className="color-line">概念指数 {format.ajustFix(data.score)}</div>
                <table>
                    <tbody>
                        <tr>
                            <td>评级</td>
                            <td>概念</td>
                        </tr>                            
                        {
                            grade.map(function (item, index) {
                                var temp = index;
                                if (index > 0) {
                                    temp = index + 1;
                                }
                                return (
                                    <tr className={"tip-" + temp}>
                                        <td>{item.grade}</td>
                                        <td>{item.name}</td>
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
            <div className='content-box description-box'>
                <div className="name"><span>事件描述</span></div>
                <div className="title">
                    <span>收购方</span>
                    <span className="msg-tag">{data.acquiring}</span>
                    <span>被收购方</span>
                    <span className="msg-tag">{data.acquired}</span>

                    <If when={typeof data.score == 'number'}>
                        <span className="color-text right"
                            onMouseEnter={me.showTip()} onMouseLeave={me.showTip(true)}>
                                <span>概念评级:{config.gradeText[data.grade]}</span>
                                <span className="qa-mark">?</span>
                        </span>
                    </If>
                </div>

                <div className="description" dangerouslySetInnerHTML={{__html: data.description}}></div>

                <If when={typeof data.score == 'number'}>
                    {me.getGrade(data)}
                </If>
            </div>
        );
    }
});

module.exports = Description;