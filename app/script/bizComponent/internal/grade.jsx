/**
 * @file 内部交易-评级
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var Star = require('../../component/star');
var LevelBlock = require('../../component/levelBlock');
var config = require('./config');
var _ = require('lodash');

var Grade = React.createClass({

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
                },
                clickGrade
            }
        } = this;
        var block = [];
        var eventType = event.event_type;
        var gradeField = config.gradeField[eventType];
        var blockText = '';
        var clazz = '';

        if (_.isArray(gradeField)) {
            _.forEach(gradeField, function (field) {
                var score = serial_events['score_' + field];
                var grade = serial_events['level_' + field];

                block.push({
                    name: config.gradeFieldText[field],
                    score: format.ajustFix(score),
                    grade: config.gradeText[grade],
                    field: field,
                    gradeScore: grade
                });
            });
        }
        else {
            blockText = gradeField;
        }

        blockText = me.getBlcokText(blockText, serial_events, event);

        if (blockText) {
            block = [];
            clazz = 'no-grade';
        }

        return {
            typeText: config.typeText[eventType],
            eventType: eventType,
            block: block,
            blockText: blockText,
            star: serial_events.score,
            clazz: clazz
        }
    },

    getBlcokText: function (text, serialEvents, event) {
        var result = text;

        if (serialEvents.score == -1) {
            if (event.event_type == 1 || event.event_type == 0) {
                if (serialEvents.unlock && serialEvents.unlock[0]
                     && serialEvents.unlock[0].gr <= 0) {
                    text = '承诺业绩无增速，不作评级';
                }
                else {
                    text = '解锁条件为营业收入，不作评级';
                }
            }
            else if (event.event_type == 6 || event.event_type == 7) {
                text = '减持不评级';
            }
            else {
                text = '计划价格未给出，不作评级';
            }
        }

        return text;
    },

    getCode: function (data) {
        if (data.blockText) {
            return (
                <div className="block-text no-grade">{data.blockText}</div>
            )
        }
        return (
            <div className="rule-container">
                <p>评级规则</p>
                <p>{config.code[data.eventType]}</p>
            </div>
        )
    },

        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className="internal-dialog-grade msg-component-grade">
                <div className="score-line">
                    <div className={"score-container " + data.clazz}>
                        <p>
                            <If when={data.eventType > 1}><span>累计</span></If>
                            事件评级
                        </p>
                        <p className={"star star-" + data.star}>
                            <If when={!data.blockText}>
                                <Star star={data.star} />
                            </If>
                        </p>
                        <p className="zero-star">
                            <If when={!data.blockText && !data.star}>
                                <span>(0星)</span>
                            </If>
                        </p>
                    </div>

                    {me.getCode(data)}

                    {
                        data.block.map(function (item) {
                            return (<LevelBlock data={item} onClick={() => {me.props.clickGrade(item.field)}}/>)
                        })
                    }
                </div>
            </div>
        );
    }
});

module.exports = Grade;