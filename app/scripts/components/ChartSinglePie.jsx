import React ,{Component} from 'react';
import echarts from 'echarts/lib/echarts';
import chartTmpl from '../util/chartTmpl';
import _ from '_';
import format from '../util/format';
import theme from 'echarts/theme/macarons';

require('echarts/lib/chart/pie');

export default class ChartSinglePie extends Component {
  constructor(props) {
    super(props);
  }
  state ={
    option:chartTmpl.slingPie
  }
  initChart() {
    let {option} = this.state;
    let range = isNaN(parseFloat(this.props.data * 100))?0:parseFloat(this.props.data * 100);
    option.series[0].data[0].value= parseInt(range);
    option.series[0].data[1].value= 100-parseInt(range);
    option.series[0].data[0].name= this.props.name;
    const node = this.refs.chart.getDOMNode();
    const mychart = echarts.init(node);
    mychart.setOption(option);
  }
  componentDidMount(){
    this.initChart();
  }
  componentDidUpdate(prevProps, prevState) {
    this.initChart();
  }
  render() {
    return (
      <div className="item-chart" ref="chart" />
    );
  }
}
