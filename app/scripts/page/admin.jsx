"use strict";
/**
 * 春训营－后台
 */

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');;
const SpringModel = require('../model/springModel');
const Reflux = require('reflux');
const ReloadStore = require('../stores/ReloadStore');
const UserInfo = require('../util/userInfo');
import MergerModal from '../model/mergerModal';
const Model = new MergerModal();
import If from '../components/If';

const AdminPage = React.createClass({
  mixins: [Reflux.connectFilter(ReloadStore, 'reload', function(data) {
    if (data){
      Model.userinfo((data) => {
        UserInfo.set(data);
        if(data.status) {
          this.getData();
        }
      });
    }
    else {
      window.location.reload();
    }

    return data;
  }) ],

  getInitialState: function() {
    return {
      isAccount: !false,
      isTask: !false,
      isAnswer: !false,
      userInfo: {},
      isStatus: false,
      isAdmin: false
    }
  },

  componentDidMount: function() {
    // 判断管理员权限
    this.getData();
  },

  componentWillReceiveProps: function(nextProps) {
    this.getData();
  },

  getData: function() {
    let {
      status = false,
      data
    } = UserInfo.get();

    if(status) {
      SpringModel.studentsUserInfo(data.user_id, result => {
        let {
          status = false,
          data = {}
        } = result;

        this.setState({
          role: data.role_type,
          isStatus: status,
          userInfo: data,
          isAccount: data.role_type == 0,
          isTask: data.role_type != 2,
          isAnswer: data.role_type == 0,
          isAdmin: data.role_type == 0
        });
      });
    }
    else {
      this.alertMsg('warning','暂未登陆','登陆后查看');
    }

  },

  render: function() {
    let {
      state: {
        isAccount,
        isTask,
        isAnswer,
        isStatus,
        isAdmin,
        userInfo
      }
    } = this;


    return (
      <div className="container bn">
          <aside className="tally-nav">
            <ul className="nav-menu">
              <If when={isAdmin}>
                <li className="pure-menu-selected">
                  <Link to='/admin/taskList' activeClassName="activeLink" >
                    <i className="fa fa-database" />每期作业
                  </Link>
                </li>
              </If>
              <If when={isAdmin}>
                <li className="pure-menu-selected">
                  <Link to='/admin/answerlist' activeClassName="activeLink" >
                    <i className="fa fa-database" />发布答案
                  </Link>
                </li>
              </If>
              <If when={isAdmin}>
                <li className="pure-menu-selected">
                  <Link to='/admin/userlist' activeClassName="activeLink" >
                    <i className="fa fa-database" />用户列表
                  </Link>
                </li>
              </If>
            </ul>
          </aside>
          <div className="tally-right-container">
            <div className="tally-content">
              <RouteHandler isAdmin={isAdmin} userInfo={userInfo} />
            </div>
          </div>
      </div>
    );
  }
});

module.exports = AdminPage;
