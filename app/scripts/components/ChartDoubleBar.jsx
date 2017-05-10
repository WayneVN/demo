import React,{Component,PropTypes} from 'react';
import echarts from 'echarts/lib/echarts';
import chartTmpl from '../util/chartTmpl';
import _ from '_';
import Format from '../util/format.js';
import theme from 'echarts/theme/macarons';
require('echarts/lib/chart/bar');

export default class ChartDoubleBar extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    data:[],
  }
  state={
    option:chartTmpl.dbar
  }
  initChart(){
    let Xlist = [];
    let Ylist = [];
    if (_.isEmpty(this.props.data)) {
      let n = this.refs.chart.getDOMNode();
      let m = echarts.init(n,theme);
      m.setOption(this.state.option);
      return ;
    }
    const {
      props: {
        data: {
          performance = [],
          increase_ratio,
          value_type
        }
      }
    } = this;


    /* let isNetIncome = true;
     * for (var i = 0; i < net_income.length; i++) {
     *   if (net_income[i].role == 'commitment' &&
     *       net_income[i].value <= 0
     *   ) {
     *     isNetIncome = false;
     *   }
     * }*/
    let xData = _.sortBy(performance, 'year');
    let _xData =[];
    let dataList = this.state.option;

    for (var i = 0; i < xData.length; i++) {
      if ((xData[i].role == 'commitment' || xData[i].role == 'base') && parseInt(xData[i].year)!=0) {
        _xData.push(xData[i]);
      }
    }
    for (var i = 0; i < _xData.length; i++) {
      Xlist.push(_xData[i].year);
      if (_xData[i].role === 'commitment') {
        _xData[i] = {
          value:_xData[i].value,
          itemStyle: {
            normal: {
                color: '#ff742f',
                label: {
                    show: true,
                    textStyle: {color: '#ff742f'},
                    position: 'top',
                }
            }
          }
        }
      }
      Ylist.push(_xData[i]);
    }
    dataList.xAxis[0].data = Xlist;
    dataList.series[0].data = Ylist;
    let node = this.refs.chart.getDOMNode();
    let mychart = echarts.init(node,theme);
    mychart.setOption(dataList);
  }
  componentDidUpdate(prevProps, prevState) {
    this.initChart();
  }
  render() {
    return (
      <div className='chart-md' ref="chart"/>
    );
  }
}
