"use strict";
/**
 * 内部交易 一级页面
 */

const React = require('react');
const Reflux = require('reflux');
const {Link} = require('react-router');
const Table = require('./table');
const InternalListActons = require('../actions/InternalListActions');
const InternalListStore = require('../stores/InternalListStore');
import TableInsider from './table_insider';
import Converter from './public/converter';


var RightInsider = React.createClass({
  mixins: [Reflux.connectFilter(InternalListStore, 'dataList', function(data) {
      return data;
    })],
  getInitialState: function() {
    return {
      dataList: {},
    };
  },
  componentDidMount: function() {
    let {sid: stock_id, eid: event_id} = this.props.params;
    InternalListActons.init(stock_id, event_id);
  },
  componentWillReceiveProps: function(nextProps) {
    let {sid: stock_id, eid: event_id} = nextProps.params;
    InternalListActons.init(stock_id, event_id);
  },
  render: function() {
    let {stock_name, stock_id, events} = this.state.dataList;
    return (
      <div className="panel-content">
        <div className="panel-head">
          <h2><Converter dataStr={`${stock_name}(${stock_id})`} _type="link" /></h2>
        </div>
        <div className="panel-body" style={{minHeight:700}}>
          <TableInsider data={events}  {...this.props} thead={[ '类型' , '成本' , '金额' , '占股比' , '人数' , '时间' ]}/>
        </div>
      </div>
    );
  }
});

module.exports = RightInsider;
