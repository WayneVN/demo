"use strict"
/**
 * 弹出窗口－chart
 */
const React = require('react');
const Reflux = require('reflux');
// const Modal = require('./modals').Modal;
import {Modal} from 'react-bootstrap';
const ModalBody = require('./modals').ModalBody;
const ModalFooter = require('./modals').ModalFooter;
const PopChartStore = require('../stores/PopChartStore');
const PopChartActions = require('../actions/PopChartActions');
const EchartLine = require('../components/e_chart_line');
const ModalSwitchStore = require('../stores/ModalSwitchStore');
const listConfig = require('../util/listConfig');
const format = require('../util/format');
const _ = require('_');
const numeral = require('numeral');

var PopChart = React.createClass({
  mixins: [
    Reflux.connectFilter(PopChartStore, 'chartData', function(data) {
      var dataList = data.data;

      var max = format.chartFormat(_.max(dataList,function(item){return parseFloat(item.val)}).val,data.type);
      var min = format.chartFormat(_.min(dataList,function(item){return parseFloat(item.val)}).val,data.type);
      // 取中位数
      var median = ((dataList.length - 1)/2 + (dataList.length /2))/2;
      var sortList = _.sortBy(dataList,function(item){return parseFloat(item.val)});
      var _median = format.chartFormat(sortList[parseInt(median)].val,data.type);

      var lastVal = format.chartFormat(dataList[dataList.length-1].val,data.type);

      data.max = max.data==0?'-':max.data;
      data.min = min.data==0?'-':min.data;
      data.median = _median.data==0?'-':_median.data;
      data.lastVal = lastVal.data==0?'-':lastVal.data;
      data.title = max.name;
      let {type} = data;
      if (type!='closing_price' && type!='pe' && type!='pb') {
        data.max = numeral(data.max).format('0.00%');
        data.min = numeral(data.min).format('0.00%');
        data.median = numeral(data.median).format('0.00%');
        data.lastVal = numeral(data.lastVal).format('0.00%');
      }
      return data;
    }),
    Reflux.listenTo(ModalSwitchStore,'open'),
  ],
  getInitialState: function() {
    return {
      show:false,
      chartData: {
        data:[
          {date:'-',val:'-'}
        ],
        max:{val:null},
        min:{val:null},
        median:{val:null},
        lastVal:{val:null},
      }
    };
  },
  open: function() {
    this.setState({
      show:true
    });
  },
  hi:function(e) {
    this.setState({
      show:false
    });
  },
  render: function() {
    var len = this.state.chartData.data.length;
    return (
      <div className="bs-modal modal-big-chart">
        <div className="modal-container" >
          <Modal show={this.state.show}
            dialogClassName="custom-modal-lg panel-step-bg "
            container={this}
            aria-labelledby="contained-modal-title"
            onHide={this.hi}
            >
            <Modal.Header>
              <Modal.Title id="contained-modal-title">
                <a href="javascript:;" className="flr" onClick={this.hi}><i className="fa fa-times"></i></a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-chart-title">
                <span className="code">{this.state.chartData.stock_id} &nbsp;&nbsp;</span>
                <span className="title">{this.state.chartData.stock_name}</span>
                <span className="smail">&nbsp;{this.state.chartData.title}</span>
                <span className="time">{this.state.chartData.data[0].date}&nbsp;&nbsp;至&nbsp;&nbsp;{this.state.chartData.data[len-1].date}</span>
                <ul className="detail-list">
                  <li>最大值:{this.state.chartData.max}</li>
                  <li>最小值:{this.state.chartData.min}</li>
                  <li>中位数:{this.state.chartData.median}</li>
                  <li>最新值:{this.state.chartData.lastVal}</li>
                </ul>
              </div>
                <EchartLine
                   active='active'
                   clazz="chart-big"
                   data={this.state.chartData.data}
                   dataName={this.state.chartData.type}
                   name={this.state.chartData.stock_name}
                   stockId={this.state.chartData.stock_id}
                   title={this.state.chartData.title}
                 />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = PopChart;
