/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面－树形图"
 */
'use strict';
const React = require('react');
const TrackingModel = require('../../../model/trackingModel');
const {Modal} = require('react-bootstrap');
const echarts = require('echarts/lib/echarts');;
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const _ = require('_');
const numeral = require('numeral');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');
const logger = require('../../../util/logger');
require('echarts/lib/chart/pie');

//stock-股票, fund-基金, bond-债券 cash-现金
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
  money: {
    name: '现金',
    color: '#feb44e'
  }
};

const COLOR = '#274982';

const DistributionChartModal = React.createClass({
  initChart() {
    let tpl = _.cloneDeep(this.props.option);
    let len = tpl.series[0].data.length;

    tpl.series[0].radius = [35,140];
    tpl.series[0].center = ['50%', '50%'],
    tpl.series[0].label.normal.show = true;
    tpl.series[0].label.normal.textStyle = {
      fontSize:16
    };
    tpl.series[0].lableLine.normal.show = true;
    tpl.legend.x = 800;
    tpl.legend.orient = 'vertical';
    tpl.legend.itemHeight = 15;
    tpl.legend.itemWidth = 30;
    tpl.silent = false;

    for(var i = 0 ; i < len; i++) {
      tpl.series[0].data[i].itemStyle.normal.label.show = true;
      tpl.series[0].data[i].itemStyle.normal.labelLine.show = true;
      tpl.series[0].data[i].itemStyle.normal.label.formatter = function(item) {
         return `${ item.name }持仓： ${ numeral(item.value).format('0.0%') }`;
      };
      tpl.legend.textStyle = {
        fontSize: 18
      };
    }


    const node = this.refs.bigChart.getDOMNode();
    const mychart = echarts.init(node);
    mychart.setOption(tpl);
  },


  componentDidMount() {
    logger.log({
      target: 'init_distributionChartModal'
    });
    this.initChart();
    // this.updateOption();
  },

  updateOption() {

  },

  activeModal() {
    this.setState({isShow: !this.state.isShow});
  },

  renderDom() {
    const {
      props: {
        name,
        num
      }
    } = this;

    return (
      <div className="bigChart-panel">
        <div className="bigChart-panel-head">
          <span className="bigChart-panel-title">最大持仓</span>
          <span className="bigChart-panel-subtitle">({name})</span>
          <span className="bigChart-panel-num">{num}</span>
          <i className="fa fa-remove"
             onClick={()=>{this.props.closeModal()}}
          />
        </div>
        <div className="bigChart-panel-body">
          <div ref="bigChart" style={{
            width: 920,
            height: 380,
          }}/>
        </div>
      </div>
    );
  },

  render() {
    return (
      <Modal show={true}
             container={this}
             {...this.props}
             {...this.state}
             dialogClassName="chart-modal-lg"
             onHide={() => {
                 this.props.closeModal()
               }}
      >
        {this.renderDom()}
      </Modal>
    );
  }
});

module.exports = DistributionChartModal;
