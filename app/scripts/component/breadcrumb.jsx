/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "通用面包屑"
 */
"use strict";
const React = require('react');
const Reflux = require('reflux');
const moment = require('moment');
import Router, {RouteHandler, Link} from 'react-router';
const _ = require('_');

const Breadcrumb = React.createClass({
  getDefaultProps() {
    return {
      uri: [],

    };
  },

  render() {
    const {
      props: {
        uri,
        _target
      }
    } = this;

    return (
      <ol className="breadcrumb">
        {
          uri.map((item, k) => {
            return <li key={k}>
        <a href={item.path} target={item.target}>{item.name}</a>
            </li>
          })
        }
      </ol>
    );
  }
});

module.exports = Breadcrumb;
