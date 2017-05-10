"use strict";
/**
 * 消息神器 并购重组二级页面
 */
const React = require('react');
/* const Tab = require('../components/tab-lg');
 * const MergerLeftSelect =require('../components/merger_left_select');
 * const LeftSelect =require('../components/left_select');
 * const LeftResult = require('../components/left_result');*/

const RightMerger = require('../components/right_merger');

/* const RightInsider = require('../components/right_insider');
 * const RightInsiderDetail =require('../components/right_insider_detail');*/

var logger = require('../util/logger');


var MergerList = React.createClass({

  render: function() {
    logger.log({target: 'web_msg_merger_detail_pv'});
    return (
      <div className="container ">
        {/* <div className="panel-left animated fadeInRight">
        <Tab/>
        <MergerLeftSelect />
        <LeftResult linkType='merger'/>
        </div> */}
        <div className="panel-right animated fadeInRight">
            <RightMerger {...this.props} />
        </div>
      </div>
    );
  }
});

module.exports = MergerList;
