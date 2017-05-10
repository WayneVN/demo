/**
 * 春训营－每期作业-作业列表
 * @author chenmin@joudou.com
 */

"use strict";

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');
const Dropzone = require('react-dropzone');
import ReactToastr ,{ToastContainer} from "react-toastr";
import If from '../../If';
const moment = require('moment');
const _  = require('_');
const UpdateTask = require('./updateTask');
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
const SpringModel = require('../../../model/autumnModel');

const Table = React.createClass({
  getInitialState: function () {
    return {
      show: false,
      showEvaluate: false,
      showUpdate: false,
      updataObj: {},
      files: [],
      disabledBtn: true,
      isAdmin: this.props.isAdmin,
      userInfo: this.props.userInfo,
      list: [],
    };
  },

  componentDidMount: function() {
    this.getData();
  },

  getData: function() {
    const {
      props: {
        userInfo: {
          user_id
        }
      }
    } = this;
    if (!user_id) {
      return ;
    }
    SpringModel.assitJobList(user_id, result => {
      let {
        status,
        data
      } = result;
      this.setState({
        list: data
      });
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      isAdmin: nextProps.isAdmin
    }, () => {
      this.getData();
    });
  },

  publish: function(job_id) {
    SpringModel.publishJob({
      uid: this.state.userInfo.user_id,
      job_id: job_id
    } ,result => {
      if(result.status) {
        this.alertMsg('success',
                      '答案已成功发布！',
                      '成功',
                     );
        this.getData();
      }
    });
  },

  hide: function() {
    this.setState({
      showUpdate: false
    });
  },

  openUpdate: function(id) {
    this.setState({
      showUpdate: true,
      updataObj: _.find(this.state.list, o => o.job_id == id)
    });
  },

  alertMsg: function (type, title, msg) {
    this.refs.alert[type](
      title,
      msg,
      {
        timeOut: 5000,
        extendedTimeOut: 1000
      }
    );
  },

  render: function () {
    let {
      state: {
        list = [],
        isAdmin,
        showUpdate
      }
    } = this;

    return (
        <div>
          <ToastContainer
             ref="alert"
             toastMessageFactory={ToastMessageFactory}
             className="toast-top-right" />
          <If when={showUpdate}>
            <UpdateTask
               {...this.state}
               {...this.props}
               hide={this.hide}
               alert={this.alertMsg }
               getdata={this.getData}
               />
          </If>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>序号</th>
                <th>时间</th>
                <th>作业</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((item,k) => {
                  return <tr key={k}>
                    <td>{k+1}</td>
                      <td>{item.upload_time?moment(item.upload_time * 1000).format('YYYY/MM/DD HH:mm') :''}</td>
                        <td>{item.job_title}</td>
                          <td>
                              <If when={isAdmin}>
                                  <span className="jd-btn jd-btn-orange"
                                          onClick={event => {this.openUpdate(item.job_id)}}>
                                      修改
                                    </span>
                                </If>
                            </td>
                            <td>
                                <If when={item.job_stauts != 1 && isAdmin }>
                                    <span
                                     className="jd-btn jd-btn-orange"
                                     onClick={event => { this.publish(item.job_id) }}
                                    >
                                        发布
                                      </span>
                                </If>
                                 <If when={item.job_stauts == 1 && isAdmin}>
                                     <i className="fa fa-check-square color-down"></i>
                                 </If>
                              </td>
                              <td>
                                  <a href={`#/autumnadmin/tasktable/${item.job_id}`}
                                     className="jd-btn jd-btn-orange"
                                   >
                                       作业列表
                                  </a>
                              </td>
                         </tr>
                })
              }
            </tbody>
          </table>
        </div>
    );
  }
});

module.exports = Table;
