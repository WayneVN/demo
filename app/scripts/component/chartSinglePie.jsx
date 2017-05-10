import React ,{Component} from 'react';
import echarts from 'echarts/lib/echarts';
import chartTmpl from '../util/chartTmpl';
import _ from '_';
import format from '../util/format';
import theme from 'echarts/theme/macarons';
const If = require('../component/if');
const Loading = require('../component/loading');
const Tooltip = require('rc-tooltip');

require('echarts/lib/chart/pie');

export default class ChartSinglePie extends Component {
  constructor(props) {
    super(props);
    this.state ={
      option:chartTmpl.slingPie,
      clazz: '',
    }
  }

  initChart(self) {
    let {option} = this.state;
    const {
      num,
      color,
      title
    } = self;

    let range = isNaN(parseFloat(num))?0:parseFloat(num);
    range *= 100;
    option.title.text= title;
    option.renderAsImage = true;
    option.series[0].itemStyle.normal.color = color;
    option.series[0].data[0].value= parseInt(range);
    option.series[0].data[1].value= 100-parseInt(range);
    option.series[0].data[0].name= '';
    const node = this.refs.chart.getDOMNode();
    const mychart = echarts.init(node);
    mychart.setOption(option);
  }

  componentDidMount(){
    this.initChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initChart(nextProps);
  }

  renderLoading() {
    return (
      <div className="report-card-sm">
        <Loading panelClazz="loader-center"/>
      </div>
    )
  }

  render() {
    const {
      props: {
        data,
        num,
        name,
        title,
        clazz
      }
    } = this;
    let {
      state: {
        value
      }
    } = this;
    return this.props.isLoading? this.renderLoading():(
      <div className={`report-card-sm ${clazz}`}>
        <div className="report-card-head">
          <span className="report-text">
            {title}
          </span>
          <If when={title=="累计收益率"}>
            <Tooltip placement="right" overlay={
              <div className="tal">
                                                连乘公式（账户收益率）: P(1+Xi) - 1
              </div>
                                                } >
              <i className="fa fa-question-circle" />
            </Tooltip>
          </If>
                    <If when={title=="累计盈亏"}>
            <Tooltip placement="right" overlay={
              <div className="tal">
                                                累计盈亏(截止当日)=净资产(当日) - 累计投入资本(截止当日)
                                                <br/>市值 : 现金 + 股票市值 + 基金市值 + 债券市值 - 负债
                                                <br/>累计投入资本(截止当日)=sum(转入现金, 转入证券市值)
                                                <br/><span style={{
                                                  marginLeft: 135
                                                }}>- sum(转出现金, 转出证券市值)</span>
              </div>
                                                } >
              <i className="fa fa-question-circle" />
            </Tooltip>
          </If>

        </div>
        <div className="report-card-body">
          <p className="report-body-title">
            {data}
          </p>
          <div className="item-chart" ref="chart" style={{
            width: 165,
            height: 165,
            marginLeft: 'auto',
            marginRight: 'auto'
          }} >
          </div>
        </div>
      </div>
    );
  }
}
