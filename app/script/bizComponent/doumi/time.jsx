/**
 * @file 斗米框 倒计时
 * @author min.chen@joudou.com
 */
var React = require('react');
var moment = require('moment');

var Time = React.createClass({

    _timeHandler: '',

    componentDidMount: function () {
        
        this.startSetTime();
    },

    componentWillUnmount: function () {
        clearInterval(this._timeHandler);
    },

    addZero: function (number) {
        var result = number;
        if (number < 10) {
            result = '0' + number
        };
        return result; 
    },

    startSetTime: function () {
        var me = this;
        var {
            props: {
                time
            }
        } = me;
        var element = me.refs.time.getDOMNode();

        if (time && !me._timeHandler) {
            me._timeHandler = setInterval(function () {
                var now = moment();
                var end = moment(time);
                var delta = end.toDate() - now.toDate();
                var text;
                var SECOND = 1000;
                var MINUTE = 60 * SECOND;
                var HOUR = 60 * MINUTE;
                var DAY = 24 * HOUR;
                var hour;
                var minute;
                var second;

                if (delta <= 0) {
                    text = '已截止';
                }
                else if (delta > DAY) {
                    text = '剩余' + Math.floor(delta / DAY) + '天'
                }
                else {
                    hour = Math.floor(delta / HOUR );
                    minute = Math.floor((delta - hour * HOUR) / MINUTE);
                    second = Math.floor((delta - hour * HOUR - minute * MINUTE) / SECOND);
                    text = '倒计时: ' + me.addZero(hour) + ':' + me.addZero(minute) + ':' + me.addZero(second);
                }

                $(element).find('.value').text(text);
                $(element).show();
            }, 1000);
        }
    },

    render: function () {

        return (
            <span className="time" ref="time">
                <span className="value"></span>
            </span> 
        );
    }
});

module.exports = Time;