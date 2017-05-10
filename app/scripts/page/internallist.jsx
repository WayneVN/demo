"use strict";

const React = require('react');
const {RouteHandler} =require('react-router');
const InsiderLeftSelect =require('../components/insider_left_select');
const LeftSelect =require('../components/left_select');
const LeftResultInternal = require('../components/left_result_Internal');
const RightMerger = require('../components/right_merger');
const RightInsider = require('../components/right_insider');
const RightInsiderDetail =require('../components/right_insider_detail');
const Tab = require('../components/tab-lg');
var logger = require('../util/logger');


var InternalList = React.createClass({
  componentDidMount: function() {
  },
  render: function() {
    logger.log({target: 'web_msg_internal_detail_pv'});

    return (
      <div className="container bn">
        {/* <div className="panel-left animated fadeInRight">
        <Tab/>
        <InsiderLeftSelect />
        <LeftResultInternal />
        </div> */}
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

module.exports = InternalList;
