/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "训练营-layout"
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const ReloadStore = require('../stores/ReloadStore');
const {Route, Link, RouteHandler} = require('react-router');
const SummerModel = require('../model/summerModel');
import ReactToastr, {ToastContainer} from "react-toastr";
import MergerModal from '../model/mergerModal';
const Model = new MergerModal();
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const UserInfo = require('../util/userInfo');
const logger = require('../util/logger');
const Loading = require('../component/loading');
import storage from '../util/storage';
const Storage = new storage();

import If from '../components/If';
const _ = require('_');

const SummerPage = React.createClass({
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
      data: {},
      loading: true
    }
  },

  componentDidMount: function() {
    // 判断学员类型
    this.getData();
    const targetMap = {
      1: 'camp.class.index.spring2016',
      2: 'camp.class.index.summer2016',
      3: 'camp.class.index.autumn2016',
      4: 'camp.class.index.autumnpro2016'
    };

    logger.log({
      target: targetMap[this.props.params.courseId]
    });
  },

  getData: function() {
    let uid = UserInfo.get().data.user_id;
    if (uid) {
      SummerModel.getUserInfo(uid, result => {
        let {
          status=true,
          data
        } = result;

        this.setState({
          data: data,
          loading: false
        });

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
        data,
        loading
      }
    } = this;
    const {
      props: {
        params: {
          courseId
        }
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
                  <Link to={`/camps/${ courseId }/account`} activeClassName="activeLink" >
                    <i className="fa fa-user" />我的帐户
                  </Link>
                </li>
                <li className="pure-menu-selected">
                  <Link to={`/camps/${ courseId }/task`}  activeClassName="activeLink" >
                    <i className="fa fa-tasks" />每期作业
                  </Link>
                </li>
              <If when={true}>
                <li className="pure-menu-selected">
                  <Link to={`/camps/${ courseId }/answer`} activeClassName="activeLink" >
                    <i className="fa fa-th-list" />每期答案
                  </Link>
                </li>
              </If>
            </ul>
          </aside>
          <div className="tally-right-container">
            <div className="tally-content">
              {
                loading? <Loading />: <RouteHandler data={data}/>
              }
            </div>
          </div>
      </div>
    );
  }
});

module.exports =  SummerPage;
