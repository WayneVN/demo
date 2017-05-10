/**
 * @file 并购-评级
 * @author min.chen@joudou.com
 */

var React = require('react');
var format = require('../../util/format');
var If = require('../../component/if');
var Star = require('../../component/star');
var LevelBlock = require('../../component/levelBlock');
var config = require('./config');
var _ = require('lodash');
var Tooltip = require('rc-tooltip');

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
                    impact
                },
                clickGrade
            }
        } = this;
        var block = [];

        _.forEach(config.gradeField, function (item) {
            var field = item.field;
            var obj = impact['impactValue' + field];

            block.push({
                name: item.text,
                score: format.ajustFix(obj.value),
                grade: (typeof obj.level == 'number') ? config.gradeText[obj.level] : '未评级',
                field: field,
                gradeScore: obj.level
            });
        });
        

        return {
            block: block,
            star: impact.impactValue,
        }
    },

    getCode: function (data) {
        var text = (
            <div>
                <div className="A-tip">
                    <div>当估值取PB评级时，A*=A</div>
                    <div>当估值取PEG评级时，A*=A/2</div>
                </div>
                <div className="X-tip">
                    <div className="color-line">X=B*C</div>
                    <table>
                        <tbody>
                            <tr>
                                <td>X</td>
                                <td>指数</td>
                            </tr>
                            <tr>
                                <td>(0,2]</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <td>(2,4]</td>
                                <td>0.5</td>
                            </tr>
                            <tr>
                                <td>4以上</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
        return (
            <div className="rule-container">
                <p>评级规则</p>
                <Tooltip placement="bottom" overlay={text} overlayClassName="merger-code-tip">
                    <p>A*+X+D</p>
                </Tooltip>
            </div>
        )
    },

        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className="merger-dialog-grade msg-component-grade">
                <div className="score-line">
                    <div className={"score-container " + data.clazz}>
                        <p>事件评级</p>
                        <p className={"star star-" + data.star}>
                            <If when={typeof data.star == 'number'}>
                                <Star star={data.star} />
                            </If>

                            <If when={typeof data.star != 'number'}>
                                <span>未评级</span>
                            </If>
                        </p>
                        <p className="zero-star">
                            <If when={typeof data.star == 'number' && !data.star}>
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