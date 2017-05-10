/**
 * 春训营－每期答案-答案列表
 * @author chenmin@joudou.com
 */

"use strict";

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');
const Dropzone = require('react-dropzone');
import ReactToastr ,{ToastContainer} from "react-toastr";
import If from '../../If';
const moment = require('moment');
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
const SpringModel = require('../../../model/springModel');
const UpdataAnswer = require('./updateAnswoer');
const _ = require('_');

const Table = React.createClass({
  getInitialState: function () {
    return {
      show: false,
      isAdmin: this.props.isAdmin,
      userInfo: this.props.userInfo,
      params: {},
      list: []
    }
  },

  componentDidMount: function() {
    this.getData();
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      isAdmin: nextProps.isAdmin,
      userInfo: nextProps.userInfo,
    }, () => {
      this.getData();
    });
  },

  getData: function() {
    let {
      state: {
        isAdmin,
        userInfo: {
          user_id
        }
      }
    } = this;

    SpringModel.answerList(user_id, result => {
      let {
        status,
        data
      } = result;
      this.setState({
        list: data
      });
    });
  },

  publish: function(job_id) {
    SpringModel.publishAnswer({
      uid: this.state.userInfo.user_id,
      answer_id: job_id
    } ,result => {
      if(result.status) {
        this.alertMsg('success',
                      '答案已成功发布！',
                      '成功',
                     );
        this.getData();
      }
      else {
        this.alertMsg('error',
                      '失败',
                      result.message
                     );
      }
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

  // 切换状态
  checkStatus: function() {
    this.setState({
      show: !this.state.show
    });
  },

  // 切换状态并且穿参数
  openModal: function(id) {
    this.setState({
      show: true,
      params: _.find(this.state.list, {"id":id})
    });
  },

  render: function () {
    let {
      state: {
        list = [],
        isAdmin,
        show,
        params
      }
    } = this;

    return (
        <div>
          <ToastContainer ref="alert" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
          <If when={show}>
            <UpdataAnswer
               hide = {this.checkStatus}
               alert = {this.alertMsg}
               item = {params}
               getData = {this.getData}
               {...this.props}
               show={show}
               />
          </If>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>序号</th>
                <th>时间</th>
                <th>答案</th>
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
                        <td>{item.title}</td>
                          <td>
                              <If when={isAdmin}>
                                  <span
                                       className="jd-btn jd-btn-orange"
                                       onClick = { event => { this.openModal(item.id) } }
                                       >
                                      修改
                                    </span>
                                </If>
                            </td>
                            <td>
                                <If when={ item.answer_status != 1}>
                                    <span
                                         className="jd-btn jd-btn-orange"
                                         onClick={event => { this.publish(item.id) }}
                                         >
                                        发布
                                      </span>
                                  </If>
                                  <If when={ item.answer_status == 1}>
                                      <i className="fa fa-check-square color-down"></i>
                                    </If>
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
