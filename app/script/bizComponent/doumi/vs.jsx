/**
 * @file 斗米框 vs bar
 * @author min.chen@joudou.com
 */
var React = require('react');

var VS = React.createClass({

    render: function () {
        var {
            props: {
                data
            }
        } = this;
        var MIN = 35;
        var width = data.width || 360;
        var amount1 = data.amount1 || 1;
        var amount2 = data.amount2 || 2;
        var total = amount1 + amount2;
        var ratio1 = Math.round(amount1 / total * 100);
        var ratio2 = 100 - ratio1;

        var width1 = ratio1 * width / 100;
        var width2 = ratio2 * width / 100;

        if (width1 < MIN) {
            width1 = MIN;
            width2 = width - MIN;
        }

        if (width2 < MIN) {
            width2 = MIN;
            width1 = width - MIN;
        }


        return (
            <div className="vs-bar">
                <div>
                    <span className="right-text">{data.option2}</span>
                    <span className="left-text">{data.option1}</span>
                </div>

                <div>
                    <div className="right-bar" style={{width: width2 + 'px'}}>{ratio2}%</div>
                    <div className="left-bar" style={{width: width1 + 'px'}}>{ratio1}%</div>
                    <div className="vs">VS</div>
                </div>
            </div>
        );
    }
});

module.exports = VS;