/**
 * 春训营－我的帐户-帐户信息
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const SpringModel = require('../../../model/autumnModel');
const ReloadAction = require('../../../actions/ReloadActions');
const userinfo = require('../../../util/userInfo');
const logger = require('../../../util/logger');
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
    if (this.props.user.user_id) {
      this.setState({
        show: !this.state.show
      });
    }
    else {
      this.alertMsg('error','请在登录后进行报名','无法报名');
    }

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
            <img src="./images/JOUDOU.COM.png"/>
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
      email: email
    };

    SpringModel.userRegister(obj, result => {
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
            target: 'autumn2016_singup'
          });
          this.props.cb();
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
        userInfo,
        status
      }
    } = this;
    const ROLE_LIST = {
      0: '未审核',
      1: '普通',
      2: '付费'
    };

    if(!status) {
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
          {ROLE_LIST[+userInfo.student_type]}
        </span>
      )
    }
  },

  render: function () {
    const {
      props: {
        userInfo
      }
    } = this;

    return (
      <div className="spring-userinfo">
        <ToastContainer ref="alert"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
        {this.renderModal()}
        <div className="s-line-group fll">
          <label>用户名</label>
          <p>{userInfo.user_name}</p>
        </div>
        <div className="s-line-group fll">
          <label>类型</label>
          <p>
            {this.renderBtn()}
          </p>
        </div>
        <div className="s-line-group fll">
          <label>班级</label>
          <p>{userInfo.class_id}</p>
        </div>
      </div>
    );
  }
});

module.exports = UserInfo;
