"use strict";
/**
 * 春训营－我的帐户
 * @author chenmin@joudou.com
 */

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');
const Table = require('./accountModule/table');
const UserInfo = require('./accountModule/userinfo');
const SpringModel = require('../../model/autumnModel');
const userinfo = require('../../util/userInfo');
const logger = require('../../util/logger');
import If from '../If';
import Loading from '../../components/loader';
const LoginStore = require('../../stores/LoginStore');
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
    logger.log({
      target: 'autumn2016_account_page'
    });
    this.setState({
      userInfo: this.props.userInfo,
      status: this.props.status
    });
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      userInfo: nextProps.userInfo,
      status: nextProps.status
    });
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

    return userInfo ? (
      <div>
        <UserInfo user={userInfo} status={status} cb={this.cb} {...this.props} />
        <div className="page-header">
          <h2>个人作业列表</h2>
        </div>
        <If when={status}>
          <Table userid={userInfo.user_id} iscb={iscb} {...this.props} />
        </If>
      </div>
    ): (
      <UserInfo user={userInfo} status={status} cb={this.cb} {...this.props} />
    );
  }
});

module.exports = Account;
