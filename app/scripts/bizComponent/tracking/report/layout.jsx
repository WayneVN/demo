/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面-layout"
 */

const React = require('react');
import Router, {RouteHandler, Link} from 'react-router';
const TrackingModel = require('../../../model/trackingModel');
const DailyChart = require('./dailyChart');
const PropertyChart = require('./propertyChart');
const ChartSinglePie = require('../../../component/chartSinglePie').default;
const InfoChart = require('./infoChart');
const Distributionchart = require('./distributionChart');
const CostChart = require('./costChart');
const LineChart = require('./lineChart');
const GuideMark = require('./guideMark');
const DemoMark = require('./demoMark');
//const Card = require('./card');
const ReportHead = require('./reportHead');
const Lottery = require('./lottery');
const numeral = require('numeral');
const If = require('../../../component/if');
const logger = require('../../../util/logger');
var config = require('./config');

var Setting = require('./setting');

const Layout = React.createClass({
  getInitialState() {
    return {
      pieData: { },
      isLoading: true,
      first: false,
      isclose: false,
      setting: {
        cal_type: 0,
        rank_type: 0
      }
    };
  },

  componentDidMount() {
    logger.log({
      target: 'page_account'
    });
    this.getSetting();

  },

  getSetting() {
    TrackingModel.getSetting((data) => {
      if (data.status) {
        this.setState({
          setting: data.data || {}
        }, ()=> {
          this.getPieData();
          this.getUploadsHistoryData();
        })
      }
    })
  },

  // 所有文件上传状态
  getUploadsHistoryData() {
    TrackingModel.getUploadsHistory(result => {
      let {
        data = [],
        status = false
      } = result;

      if ( status ) {
        if ( data.length == 0 ) {
          this.setState({
            first: true,
          });
        }
        else {
          let count = 0;
          data.map(item => {
            if (item.upload_status != '1') {
              count++;
            }
          });
          if (count == data.length) {
            window.location.href = '#/account/upload';
          }
        }
      }
    });
  },

  getPieData() {
    TrackingModel.getUserAccumulative(result => {
      if (result.status) {
        this.setState({
          pieData: result.data,
          isLoading: false
        });
      }
    });
  },

  onSettingChange(param) {
    var me = this;
    var calculateType = param.calculateType;
    var rankType = param.rankType;

    TrackingModel.setSetting({
      cal_type: calculateType,
      rank_type: rankType
    },(data) => {
      if (data.status) {
        me.setState({
          setting: {
            cal_type: +calculateType,
            rank_type: +rankType
          }
        });
      }
    })
  },


  render() {
    let {
      state: {
        pieData,
        isLoading,
        first,
        setting,
        isclose
      }
    } = this;
    var calculateType = (setting && +setting.cal_type) || config.calType.average;

    return (
        <div className="container-report-bg">
          {/* <Card /> */}
            <Setting onOk={this.onSettingChange} setting={setting}/>
            <ReportHead first={first}/>
            <div className="container-report-body">
                <If when={first}>
                    <DemoMark/>
                </If>
                <LineChart setting={setting}/>
                <If when={calculateType == config.calType.total}>
                    <ChartSinglePie
                        data={numeral(pieData.multiply_profit_ratio).format('0.0%')}
                        num={pieData.multiply_ratio_ranking}
                        isLoadig={isLoading}
                        title="收益排名"
                        icon=""
                        color="#35a3ff"
                        clazz=""
                    />
                </If>
                <If when={calculateType == config.calType.average}>
                    <ChartSinglePie
                        data={numeral(pieData.accumulative_profit_ratio).format('0.0%')}
                        num={pieData.profit_ratio_ranking}
                        isLoadig={isLoading}
                        title="收益排名"
                        icon=""
                        color="#35a3ff"
                        clazz=""
                    />
                </If>
                <ChartSinglePie
                    data={numeral(pieData.accumulative_profit).format('0,0')}
                    num={pieData.profit_ranking}
                    isLoadig={isLoading}
                    title="累计盈亏"
                    icon=""
                    color="#fead35"
                    clazz="m0"
                />
                <DailyChart />
                <PropertyChart />
                <CostChart />
                <Distributionchart />
                <InfoChart setting={setting} />
            </div>
        </div>
    )
  }
});

module.exports = Layout;
