/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－树形图"
 */

const React = require('react');
const TrackingModel = require('../../../model/trackingModel');
const echarts = require('echarts/lib/echarts');;
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const _ = require('_');
const numeral = require('numeral');
require('echarts/lib/chart/treemap');

const option = {
  legend: {
    padding: 5,
    itemGap: 15,
    x: 0,
    data: ['主板持仓', '中小板持仓', '创业板持仓']
  },
  title: {
    text: '',
  },
  tooltip: {
    trigger: 'item',
    formatter: function(item) {
      let _val = numeral(item.value)
        .format('0.00%');
      return `${ item.name }: ${ _val }`;
    }
  },
  toolbox: {
    show: false,
  },
  calculable: false,
  series: [
    {
      name: '',
      center: ['45%', '52%'],
      size: ['364', '190'],
      type: 'treemap',
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: function(o, v) {
              return  numeral(v).format('0.00%');
            },
            textStyle: {
              align: 'center',
              baseline: 'middle',
              color: '#fff',
            },
          },
          borderWidth: 1,
        },
        emphasis: {
          label: {
            show: true
          }
        }
      },
      data: []
    }
  ]
};


const MAPKEY = {
  '1': '主板持仓',
  '2': '中小板持仓',
  '6': '创业板持仓',
};

const itemStyle = {
  normal: {
    label: {
      show: true,
      formatter: function(o, v) {
        return numeral(v).format('0.00%');
      }
    },
  },
  emphasis: {
    label: {
      show: true
    }
  }
};



const TreeChart = React.createClass({
  _chart: '',

  componentDidMount() {
    this.getData();
  },

  getData() {
    TrackingModel.getUserPositionDist(result => {
      if (result.status && result.position.length) {
        this.parseData(result.position);
      }
    });
  },

  parseData(arrList = []) {
    if (arrList.length) {
      let _group = _.groupBy(arrList, 'sector');
      _.forEach(_group, (v, k) => {
        let _sum = _.sumBy(_group[k], 'value');
        let _allSum = _.sumBy(arrList, 'value');
        let _val =  _sum / _allSum;
        let _series = {
          name: MAPKEY[k],
          value: _val,
          children: _group[k].map(_item => {
            return {
              name: _item.name,
              value: _item.value / _sum,
              itemStyle: itemStyle
            };
          })
        }
        option.series[0].data.push(_series);
      });
      this.renderChart();
    }
  },

  renderChart() {
    const elm = this.refs.chart.getDOMNode();
    if (!this._chart) {
      this._chart = echarts.init(elm, theme);
    }
    this._chart.setOption(option, true);
  },

  render() {
    return (
      <div className="report-card-lg-md">
        <div ref="chart" style={{
            width: 400,
            height: 250
          }}/>
      </div>
    );
  }
});

module.exports = TreeChart;
