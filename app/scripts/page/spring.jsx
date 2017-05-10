/**
 * 春训营-用户端
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const ReloadStore = require('../stores/ReloadStore');
const {Route, Link, RouteHandler} = require('react-router');
const SpringModel = require('../model/springModel');
import ReactToastr, {ToastContainer} from "react-toastr";
import MergerModal from '../model/mergerModal';
const Model = new MergerModal();
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const UserInfo = require('../util/userInfo');
import If from '../components/If';
const _ = require('_');

const SpringPage = React.createClass({
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
      isAccount: true,
      isTask: true,
      isAnswer: false,
      userInfo: {},
      isStatus: false,
      reload: false
    }
  },

  componentDidMount: function() {
    // 判断学员类型
    this.getData();
    logger.log({
      target: 'camp.class.index.spring2016',
      data: {
        class: ''
      }
    });
  },

  getData: function() {
    let {
      status,
      data
    } = UserInfo.get();

    if(status) {
      SpringModel.studentsUserInfo(data.user_id, result => {
        let {
          status = false,
          data = {},
          message = ''
        } = result;
        if (status) {
          this.setState({
            userInfo: data,
            isStatus: status,
            isAnswer: data.student_type != 0,
          });
        }
        else {
          // this.alertMsg('warning','error',message);
        }

      });
    }
    else {
      this.alertMsg('warning','暂未登陆','登陆后查看');
    }

  },

  alertMsg: function(type, title, msg) {
    this.refs.alert[type](
      title,
      msg,
      {
        timeOut: 5000,
        extendedTimeOut: 1000
      }
    );
  },

  render: function() {
    let {
      state: {
        isAccount,
        isTask,
        isAnswer,
        userInfo,
        isStatus
      }
    } = this;

    return (
      <div className="container bn">
        <ToastContainer
           ref="alert"
           toastMessageFactory={ToastMessageFactory}
           className="toast-top-right"
           />
          <aside className="tally-nav">
            <ul className="nav-menu">
                <li className="pure-menu-selected">
                  <Link to='/spring/account' activeClassName="activeLink" >
                    <i className="fa fa-database" />我的帐户
                  </Link>
                </li>
                <li className="pure-menu-selected">
                  <Link to='/spring/task' activeClassName="activeLink" >
                    <i className="fa fa-database" />每期作业
                  </Link>
                </li>
              <If when={isAnswer}>
                <li className="pure-menu-selected">
                  <Link to='/spring/answer' activeClassName="activeLink" >
                    <i className="fa fa-database" />每期答案
                  </Link>
                </li>
              </If>
            </ul>
          </aside>
          <div className="tally-right-container">
              <div className="tally-content">
                <RouteHandler userInfo={userInfo} status={isStatus}/>
              </div>
          </div>
      </div>
    );
  }
});

module.exports = SpringPage;
