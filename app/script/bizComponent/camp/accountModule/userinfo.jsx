/**
 * 春训营－我的帐户-帐户信息
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const SummerModel = require('../../../model/summerModel');
const ReloadAction = require('../../../action/reloadAction');
const userinfo = require('../../../util/userInfo');
const logger = require('../../../util/logger');
const _ = require('lodash');
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const UserInfo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      show: false,
      email: ''
    }
  },

  checkReg: function () {
    this.setState({
      show: !this.state.show
    });
  },

  renderModal: function () {
    let {
      state: {
        show
      }
    } = this;

    return (
      <Modal show={show}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.checkReg}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="/images/JOUDOU.COM.png"/>
            <span className="flr" onClick={this.checkReg}>
              <i className="fa fa-times" />
            </span>
            <div className="step-warp" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <div className="panel-row">
                <label >*邮&nbsp;&nbsp;箱</label>
                <p>
                  <input type="email"  valueLink={this.linkState('email')} />
                </p>
              </div>
            </div>
            <div className="panel-footer">
              <span
                 className="btn-step-next flr"
                 onClick={this.send} >
                发送
              </span>
              <span
                 className="btn-step-next flr"
                 onClick={this.checkReg} >
                关闭
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  },

  send: function () {
    let {
      state: {
        nick = '',
        email = '',
        userInfo
      }
    } = this;
    let {
      status,
      data
    } = userinfo.get();

    let obj = {
      user_id: data.user_id,
      email: email,
      course_id: this.props.courseId
    };

    SummerModel.userRegister(obj, result => {
      let {
        status,
        data,
        message
      } = result;

      if(status) {
        this.setState({
          show: false
        }, () => {
          ReloadAction.reload();
          logger.log({
            target: 'summer_singup'
          });
          this.alertMsg(
            'success',
            '',
            '报名成功'
          );
        });
      }
      else {
        this.alertMsg(
          'error',
          '',
          message
        );
      }
    });
  },

  alertMsg: function (type, title, msg) {
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  // 根据权限判别按钮
  renderBtn: function () {
    const {
      props: {
        data: {
          email,
          user_name,
          uid,
          courses = []
        },
        courseId
      }
    } = this;

    const ROLE_LIST = {
      0: '未审核',
      1: '普通',
      2: '付费'
    };
    let obj = _.find(courses, ['course_id', +courseId]);
    if(!obj) {
      return (
        <span className="jd-btn jd-btn-orange" onClick={event => {
            this.checkReg()
          }}>
          立即报名
        </span>
      );
    }
    else {
      return (
        <span>
          {ROLE_LIST[+obj.student_type]}
        </span>
      )
    }
  },

  render: function () {
    const {
      props: {
        data: {
          email,
          user_name,
          uid,
          courses = []
        },
        courseId
      }
    } = this;
    let class_id = (_.find(courses, ['course_id', +courseId]) || {}).class_id;
    return (
      <div className="spring-userinfo">
        <ToastContainer ref="alert"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
        {this.renderModal()}
        <div className="s-line-group fll">
          <label>用户名</label>
          <p>{user_name}</p>
        </div>
        <div className="s-line-group fll">
          <label>类型</label>
          <p>
            {this.renderBtn()}
          </p>
        </div>
        <div className="s-line-group fll">
          <label>班级</label>
          <p>{class_id}</p>
        </div>
      </div>
    );
  }
});

module.exports = UserInfo;
