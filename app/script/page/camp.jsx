/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "训练营-layout"
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const ReloadStore = require('../store/reloadStore');
const SummerModel = require('../model/summerModel');
import ReactToastr, {ToastContainer} from "react-toastr";
import MergerModal from '../model/userModel';
const Model = new MergerModal();
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const UserInfo = require('../util/userInfo');
const logger = require('../util/logger');
const Loading = require('../component/loading');
import storage from '../util/storage';
const Storage = new storage();

import If from '../component/if';
const _ = require('_');
var url = require('../util/url');

var Account = require('../bizComponent/camp/account');
var Answer = require('../bizComponent/camp/answer');
var List = require('../bizComponent/camp/list');
var Task = require('../bizComponent/camp/task');

const Camp = React.createClass({
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
      loading: true,
      type: ''
    }
  },

  getCourseID: function () {
    return url.getSearch('id');
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
      target: targetMap[this.getCourseID()]
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

  getContent: function (type, data) {
    var courseId = this.getCourseID();

    if (!type || type == 'account') {
      return <Account data={data} courseId={courseId}/>
    }
    if (type == 'task') {
      return <Task data={data} courseId={courseId}/>
    }

    if (type == 'answer') {
      return <Answer data={data} courseId={courseId}/>
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

  clickType: function (type) {
    this.setState({
      type: type
    })
  },

  render: function() {
    let {
      state: {
        data,
        loading,
        type
      }
    } = this;
    var courseId = this.getCourseID();

    return (
      <div className="page camp-container">
        <ToastContainer
           ref="alert"
           toastMessageFactory={ToastMessageFactory}
           className="toast-top-right"
           />
          <aside className="tally-nav">
            <ul className="nav-menu">
                <li className={!type || type == 'account' ? 'selected' : ''} 
                  onClick={()=>this.clickType('account')}>
                    <i className="fa fa-user" />我的帐户
                </li>
                <li className={type == 'task' ? "selected" : ''}
                  onClick={()=>this.clickType('task')}>
                    <i className="fa fa-tasks" />每期作业
                </li>
              <If when={true}>
                <li className={type == 'answer' ? 'selected' : ''}
                  onClick={()=>this.clickType('answer')}>
                    <i className="fa fa-th-list" />每期答案
                </li>
              </If>
            </ul>
          </aside>
          <div className="tally-right-container">
            <div className="tally-content">
              {
                loading? <Loading /> :this.getContent(type, data)
              }
            </div>
          </div>
      </div>
    );
  }
});

module.exports = Camp;

// entry代码，看情况放回去，或者把整个老训练营代码删掉
// var React = require('react');
// var Head = require('../component/head');
// var Foot = require('../component/foot');
// var Camp = require('../page/camp');
// const Router = require('react-router');
// const Route = Router.Route;
// import MergerModal from '../model/userModel';
// const Model = new MergerModal();

// require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
// require('../../style/entry/camp.scss');
// require('../plugin/font.jsx');

// Model.userinfo(result => {
//     React.render(
//       <div>
//           <Head type='small' item='msg' noNeedLogin={true}/>
//           <Camp />
//           <Foot />
//       </div>, 
//     $('#content')[0]);
// });

