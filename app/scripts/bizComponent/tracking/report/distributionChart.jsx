/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－树形图"
 */
'use strict';
const React = require('react');
const TrackingModel = require('../../../model/trackingModel');
const echarts = require('echarts/lib/echarts');;
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const _ = require('_');
const numeral = require('numeral');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const iconpath = require('../../../../images/legend.svg');
const DistributionChartModal = require('../reportModal/distributionChartModal');
const Tooltip = require('rc-tooltip');

require('echarts/lib/chart/pie');

const labelFromatter = {
  normal: {
    color: '#afbace',
    label: {
      formatter: function(params) {
        return 100 - params.value + '%'
      },
      color: '#afbace',
      textStyle: {
        baseline: 'top',
        color: '#afbace',
      }
    }
  },
  emphasis: {
    color: 'rgba(0,0,0,0)'
  }
};

//stock-股票, fund-基金, bond-债券
const MAPKEY = {
  stock: {
    name: '股票',
    color: '#35a3ff'
  },
  fund: {
    name: '基金',
    color: '#fb5b5a'
  },
  bond: {
    name: '债券',
    color: '#cc67cc'
  },
  cash: {
    name: '现金',
    color: '#feb44e'
  }
};

const COLOR = '#274982';

const option = {
  silent: !true,
  minAngle: 36,
  tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
  },
  legend: {
    width: 140,
    x: 'center',
    y: 160,
    selectedMode: true,
    itemWidth: 20,
    itemHeight: 5,
    padding: 0,
    data:[
      {
        name: MAPKEY.stock.name,
        textStyle: {
          color: MAPKEY.stock.color,
        },
      },
      {
        name: MAPKEY.fund.name,
        textStyle: {
          color: MAPKEY.fund.color,
        }
      },
      {
        name: MAPKEY.bond.name,
        textStyle: {
          color: MAPKEY.bond.color,
        },
      },
      {
        name: MAPKEY.cash.name,
        textStyle: {
          color: MAPKEY.cash.color,
        },
      },
    ]
  },
  title: {
    text: '',
    show: false
  },
  series: [{
    name:'持仓比例',
    type:'pie',
    radius: [15, 60],
    center: ['50%', '40%'],
    roseType: 'radius',
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: true
      }
    },
    lableLine: {
      normal: {
        show: false
      },
      emphasis: {
        show: true
      }
    },
    data:[
    ],
  }]
};

const DistributionChart = React.createClass({
  _chart: '',

  getInitialState() {
    return {
      stockName: {},
      maxBl: 0,
      isShow: false,
      bigOption: null,
      isLoading: true
    }
  },

  initChart() {
    const node = this.refs.chart.getDOMNode();
    /* this._chart = echarts.init(node);*/
    this.setState({
      bigOption: option
    }, () => {
      /* mychart.setOption(option);*/
      if (!this._chart) {
        this._chart = echarts.init(node);
      }
      this._chart.setOption(option);
    });

  },

  parseData(arrList = []) {
    let {
      state: {
        stockName,
      }
    } = this;

    if (arrList.length) {
      let _group = _.groupBy(arrList, 's_type');
      let _stockName = _.maxBy(arrList, o => o.value );
      let _allSum = _.sumBy(arrList, 'value');
      let maxBl =  _stockName.value / _allSum;
      this.setState({maxBl});
      let list = [];

      _.forEach(_group, (v, k) => {
        list.push({
          name: MAPKEY[k].name,
          val: _.sumBy(v, 'value')/_allSum
        });
      });

      if (stockName != _stockName) {
        this.setState({
          stockName: _stockName
        });
      }

      option.series[0].data = [];
      _.forEach(_group, (v, k) => {
        let _sum = _.sumBy(v, 'value');
        let _val = _sum / _allSum; //各个板块持仓比例

        let obj = this.getItemStyle({
          name: MAPKEY[k].name,
          value: _val,
          color: MAPKEY[k].color,
        });
        option.series[0].data.push(obj);
      });
      this.initChart();
    }
  },

  getItemStyle({name = '', value = 0, color = '#d4d4d4', max = {}}) {
    return {
      name: name,
      value: value,
      itemStyle: {
        normal: {
          color: color,
          label: {
            show: false,
            formatter: function(item) {
              return '';
            },
          },
          labelLine: {
            show: false
          }
        }
      }
    };
  },

  componentDidMount() {
    this.setState({
      isLoading: false
    },() => {
      this.getData();
    });
  },

  getData() {
    TrackingModel.getUserPositionDist(result => {
      if (result.status && result.position.length) {
        this.parseData(result.position);
      }
    });
  },

  renderLoading() {
    return (
      <div className="report-card-lg-md mr10" >
        <Loading panelClazz="loader-center"/>
      </div>
    );
  },

  activeModal() {
    this.setState({isShow: !this.state.isShow});
  },

  render() {
    let {
      state: {
        stockName,
        maxBl,
        isLoading,
        bigOption,
        isShow
      }
    } = this;

    return (
             <div className="report-card-lg-md mr10" >
               <If when={isShow}>
                 <DistributionChartModal
                     isShow={isShow}
                     option={bigOption}
                     closeModal={this.activeModal}
                     name={stockName.name}
                     num= {numeral(maxBl).format('0%')}
                 />
               </If>
               <div className="report-card-head">
                 <span className="report-text">
                   持仓分布
                 </span>
                 <Tooltip placement="right" overlay={
                   <div className="tal">
                           持仓比例 = 全部(股票/基金/债券/现金)市值 / 市值
                   </div>
                                                     } >
                   <i className="fa fa-question-circle" />
                 </Tooltip>
               </div>
               <div className="report-chart-sm" ref="chart"
                    style={{
                      height: 210,
                      cursor: 'pointer'
                          }}
                    onClick={this.activeModal}
               />
               <div className="chart-round-sm" onClick={this.activeModal}/>
               <div className="chart-round-lg" onClick={this.activeModal}/>
             </div>
           );
  }
});

module.exports = DistributionChart;
