"use strict";
/**
 * 春训营－我的帐户
 * @author chenmin@joudou.com
 */

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');
const Table = require('./accountModule/table');
const UserInfo = require('./accountModule/userinfo');
const SpringModel = require('../../model/summerModel');
const userinfo = require('../../util/userInfo');
const logger = require('../../util/logger');
var If = require('../../component/if');
var Loading = require('../../component/loading');
const LoginStore = require('../../store/loginStore');
const Reflux = require('reflux');

const Account = React.createClass({

  mixins: [
    Reflux.connect(LoginStore,'userInfo'),
  ],

  getInitialState: function () {
    return {
      userInfo: null,
      status: false,
      iscb: false
    }
  },

  componentDidMount: function () {
    /* logger.log({
     *   target: 'summer_account_page'
     * });
     * this.setState({
     *   userInfo: this.props.userInfo,
     *   status: this.props.status
     * });*/
  },


  cb: function() {
    this.setState({
      iscb: this.state.iscb
    });
  },

  render: function () {
    let {
      state: {
        userInfo = {},
        status = false,
        iscb
      }
    } = this;

    return (
      <div>
        <UserInfo {...this.props} />
        <div className="page-header">
          <h2>个人作业列表</h2>
        </div>
        <Table {...this.props} />
      </div>
    );
  }
});

module.exports = Account;
