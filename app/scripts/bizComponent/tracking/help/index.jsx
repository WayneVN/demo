/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "报告页面-引导帮助"
 */

const React = require('react');
import Router, {RouteHandler, Link} from 'react-router';
const TrackingModel = require('../../../model/trackingModel');
const numeral = require('numeral');
const If = require('../../../component/if');
const logger = require('../../../util/logger');



const Help = React.createClass({

  componentDidMount() {
    logger.log({
      target: 'page_help'
    });
  },

  render() {
    return (
      <img alt="引导帮助"
           src="../../../../images/bzsc.jpg"
           style={{
             margin: '0 auto',
             width: 1400,
             display: 'block'
           }}
      />
    )
  }
});

module.exports = Help;
