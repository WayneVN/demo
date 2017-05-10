import React, {Component, PropTypes} from 'react';
import echarts from 'echarts/lib/echarts';
import _ from '_';
import formatter from '../util/format.js';
import theme from 'echarts/theme/macarons';
import Loading from '../components/loading';
require('echarts/lib/chart/bar');


export default class ChartSumBar extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoading:false
  }
  componentDidMount() {
  }
  initChart (data){
    if (!data) {
      return ;
    }
    this.setState({
      isLoading:true
    })
    let node = this.refs.chart.getDOMNode();
    let mychart = echarts.init(node,theme);
    mychart.setOption(data);
  }
  componentWillReceiveProps(nextProps) {
      this.initChart(nextProps.data);
  }
  render () {
    let hei = 600;
    return (
      <div>
        <div className='chart-ratio' ref="chart" style={{height:hei}}/>
        {this.state.isLoading || <Loading />}
      </div>
    );
  }
}
