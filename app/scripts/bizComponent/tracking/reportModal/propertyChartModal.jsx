/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "资产曲线-大图"
 */


'use strict';
var React = require('react');
var moment = require('moment');
const {Modal} = require('react-bootstrap');
const _ = require('_');
var formatter = require('../../../util/format');
var numeral = require('numeral');
var TallyModal = require('../../../model/tallyModal').default;
const logger = require('../../../util/logger');
const echarts = require('echarts/lib/echarts');
const theme = require('echarts/theme/macarons');
const zrColor = require('zrender/src/tool/color');
const If = require('../../../component/if');
const Loading = require('../../../component/loading');



const PropertyChartModal = React.createClass({
  getInitialState() {
    return {
      option: this.props.option,
      start: 0,
      end: 100
    }
  },

  getDefaultProps() {
    return {
      option: {},
      start: 0,
      end: 100,
      value: 0
    };
  },

  componentDidMount() {
    logger.log({
      target: 'init_propertyChartModal'
    });
    let obj = _.cloneDeep(this.state.option);
    obj.grid.bottom = 80;
    obj.grid.top = 70;
    obj.yAxis[0].axisLabel.textStyle.fontSize = 16;
    obj.yAxis[0].axisTick.textStyle.length = 45;
    obj.dataZoom = [{
      type: 'inside',
      start:this.props.start,
      end: this.props.end,
    }, {
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      height: 16,
      y: 390,
      fillerColor: '#15325b',
      backgroundColor: '#eee',
      start:this.props.start,
      end: this.props.end,
      dataBackground: {
        areaStyle: '#eee',
        lineStyle: {
          color: '#eee'
        }
      },
      right: 80,
      left: 80,
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    obj.dataZoom.y = 370;
    /* obj.dataZoom.start = this.props.start;
     * obj.dataZoom.end = this.props.end;*/
    obj.legend =  {
      data: [
        {
          name: '市值',
          icon: 'image://http://7xsa52.com1.z0.glb.clouddn.com/joudou/3.png'
        },
        {
          name: '投入资本',
          icon: 'image://http://7xsa52.com1.z0.glb.clouddn.com/joudou/1.png'
        }
      ],
      textStyle: {
        fontSize: 16
      },
      x: 'center'
    };
    this.setState({
      option: obj
    }, () => {
      this.renderChart();
    });

  },

  renderChart() {
    var node = this.refs.bigChart.getDOMNode();
    var mychart = echarts.init(node);
    mychart.setOption(this.state.option);
    this.onDatazoom(mychart);
  },

  onDatazoom(echartsInstance) {
    echartsInstance.on('datazoom', event => {
      this.setState({
        start: event.start,
        end: event.end
      });
    });
  },

  lastData() {
    let params = {
      start: this.state.start||this.props.start,
      end: this.state.end||this.props.end
    };
    this.props.closeModal(params);
  },

  renderDom() {
    return (
      <div className="bigChart-panel">
        <div className="bigChart-panel-head" style={{
          height: 60
        }}>
          <span className="bigChart-panel-title">当前市值</span>
          <span className="bigChart-panel-num">{this.props.value}</span>
          <i className="fa fa-remove"
             onClick={this.lastData}
          />
        </div>
        <div className="bigChart-panel-body" style={{
          height: 455
        }}>
          <div ref="bigChart" style={{
            height: 455,
            width: 920,
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
             onHide ={this.lastData}
      >
        {this.renderDom()}
      </Modal>
    );
  }

});

module.exports = PropertyChartModal;
