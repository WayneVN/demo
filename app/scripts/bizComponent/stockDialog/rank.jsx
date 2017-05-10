/**
 * @file 个股弹窗-排名
 * @author min.chen@joudou.com
 */

var React = require('react');
var model = require('../../model/stockDialogModel');
var RankItem = require('./rankItem');
var config = require('./config');
var _ = require('lodash');
var $ = require('jquery');
var Storage = require('../../util/storage').default;
var AlertActions = require('../../actions/AlertActions');
var logger = require('../../util/logger');

var Rank = React.createClass({

    getInitialState: function () {
        return {
            items: []
        };
    },

    getDefaultProps: function () {
        return {
            data: {
                pepb: {}
            }
        }
    },

    componentDidMount: function () {
    },

    componentWillMount: function () {
        var me = this;
        me.setState(me.props);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    formatData: function () {
        var me = this;
        var forecasts = me.state.data.forecasts;
        var noForecasts = me.state.data['no-forecasts'];
        var annoType = me.state.annoType;
        var hasForecast = $.isNumeric(forecasts.pepb.pe);
        var obj = annoType || !hasForecast ? noForecasts : forecasts;
        var result = [];
        var currentDate = noForecasts.earning.quarter;

        // pe
        result[0] = {
            hasForecast: hasForecast,
            value: forecasts.pepb.pe,
            value1: noForecasts.pepb.pe,
            rank: obj.pepb.pe_gt_other_rate,
            historyRank: obj.pepb.pe_gt_history_rate,
            currentDate: currentDate
        };

        // peb
        result[1] = {
            value: noForecasts.pepb.pb,
            rank: noForecasts.pepb.pb_gt_other_rate,
            historyRank: noForecasts.pepb.pb_gt_history_rate
        };

        hasForecast = $.isNumeric(forecasts.earning.earning);
        obj = annoType || !hasForecast ? noForecasts : forecasts;

        // 净利增速
        result[2] = {
            hasForecast: hasForecast,
            value: obj.earning.earning,
            rank: obj.earning.earning_gt_other_rate,
            historyRank: obj.earning.earning_gt_history_rate,
            date: obj.earning.quarter,
            quarterRate: obj.earning.quarter_rate,
            rate: forecasts.earning.quarter_rate,
            rate1: noForecasts.earning.quarter_rate,
            currentDate: currentDate
        };

        hasForecast = $.isNumeric(forecasts.revenue.revenue);
        obj = annoType || !hasForecast ? noForecasts : forecasts;
        
        // 营收增速
        result[3] = {
            hasForecast: hasForecast,
            value: obj.revenue.revenue,
            rank: obj.revenue.revenue_gt_other_rate,
            historyRank: obj.revenue.revenue_gt_history_rate,
            date: obj.revenue.quarter,
            quarterRate: obj.revenue.quarter_rate,
            rate: forecasts.revenue.quarter_rate,
            rate1: noForecasts.revenue.quarter_rate,
            currentDate: currentDate
        };

        return result;
    },

    render: function () {
        var me = this;
        var data = me.formatData();
        var annoType = me.state.annoType;

        return (
            <div className="rank">
                <div className="rank-container">
                {
                    [0, 1, 2, 3].map(function (item, index) {
                        return <RankItem data={data} type={item} annoType={annoType}/>;
                    })
                }
                </div>

            </div>
        );
    }

});

module.exports = Rank;