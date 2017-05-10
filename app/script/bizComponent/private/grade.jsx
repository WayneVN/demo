/**
 * @file 定增弹窗-评级
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
                data,
                clickGrade
            }
        } = this;
        var block = [];

        _.forEach(config.gradeField, function (item) {
            var field = item.field;
            var score = data['score_' + field];
            var grade = data['level_' + field.toLowerCase()];
            var temp;

            if (field == 'E') {
                temp = data.score_PE > data.score_PB && data.valuation_rating.after.PE > 0
                    ? 'PE' : 'PB';
                score = data['score_' + temp];
                grade = data['level_' + temp.toLowerCase()];
            }

            block.push({
                name: item.text,
                score: format.ajustFix(score),
                grade: config.gradeText[grade],
                field: field,
                gradeScore: grade
            });
        });

        return {
            block: block,
            star: data.score
        }
    },

        
    render: function () {
        var me = this;
        var data = me.formatData();

        return (         
            <div className='da-dialog-grade msg-component-grade'>
                <div className="score-container">
                    <p>综合评级</p>
                    <p className={"star star-" + data.star}>
                        <Star star={data.star} />
                    </p>
                    <p className="zero-star">
                        <If when={!data.star}>
                            <span>(0星)</span>
                        </If>
                    </p>
                </div>

                <div className="rule-container">
                    <p>评级规则</p>
                    <p>(A*C+E)/2</p>
                </div>

                {
                    data.block.map(function (item) {
                        return (<LevelBlock data={item} onClick={() => {me.props.clickGrade(item.field)}}/>)
                    })
                }
            </div>
        );
    }
});

module.exports = Grade;
