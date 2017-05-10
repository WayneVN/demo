"use strict"
const React = require('react');
const Reflux = require('reflux');
const LoginStore = require('../store/loginStore');
const OpenModalStore = require('../store/openModalStore');

const format = require('../util/format');
const LoginActions = require('../action/loginAction');
const ReloadAction = require('../action/reloadAction');
var OpenModalActions = require('../action/openModalAction');
var DialogAction = require('../action/dialogAction');
var Dialog = DialogAction.Dialog;
const _ = require('_');
import If from './if';
var PageEnum = require('../bizComponent/userCenter/config');
var userModel = require('../model/userModel').default;
var UserModel = new userModel();

var LoginInfo = React.createClass({
  getInitialState: function() {
    return {
      params: {},
      userInfo: this.props.userInfo,
      userScope: this.props.userScope,
      panelName: 'RegEmailForm',
      elm: null,
    };
  },

  getParams: function(name) {
    let step = name.indexOf('token=');
    if (step == -1) {
      return 0;
    }
    let token = name.substr(step + 1, name.length);
    return token;
  },

  componentDidMount: function() {
    let str = window.location.hash;
    let token = this.getParams(str);
    // 接到token 提示用户验证已经通过
    if (token.length > 3) {
      UserModel.verify(token, data => {
        if (data && data.status) {
          this.setState({
            panelName: 'ACTIVEATION'
          }, () => {
            this.refs.success.open();
          });
        } else {
          if (data && data.message) {
            alert(data.message);
          }
        }
      })
    }
    // 老用户没验证邮箱的出提示
    let {
      userInfo
    } = this.state;
    if (!_.isEmpty(userInfo)) {
      if (userInfo.email_verified == 0) {
        this.setState({
          panelName: 'Message'
        }, () => {
          //this.refs.message.open();
        });
      }
    }

  },

  _logout: function() {
    if (window.confirm('是否确认退出?')) {
      LoginActions.clearUser(true);
    }

  },

  openUserCenter(page) {
    DialogAction.open(Dialog.UserCenter, {
      page: page,
      userInfo: this.state.userInfo,
      userScope: this.state.userScope,
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  },

  //用户信息
  render() {
    let {
      userInfo,
      userScope
    } = this.state;
    if (!(userInfo && userInfo.username)) {
      return (
        <ul className="btn-text nologin">
          <li className="flr">
            <a href="javascript:;"
               onClick={e => {DialogAction.open(Dialog.WechatLogin)}}>登录/注册</a>
            <a href="javascript:;"
               onClick={e => {DialogAction.open(Dialog.WechatLogin)}}>
              <img src="/images/weixin_grieen_icon.png" className="weixin"/>
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <div className="btn-text">
          <a href="javascript:;" className="msg " title="站内信" onClick= {() => this.openUserCenter(PageEnum.userAccount.message)}>
            <i className={` iconfont icon-xiaoxi ${userInfo.unreadmsg?'icon-active':''} msg-icon`} />
            <div className={userInfo.unreadmsg?'unread-msg':''}>{userInfo.unreadmsg || ''}</div>

          </a>
          <span className="ml10">
            |
          </span>

          <a className="more" href="javascript:;" >
            {userInfo.username}
            <i className="fa fa-caret-down" />
            <div className="more-block">
              <img className="triangle" src="/images/triangle.png"></img>
              <ul >
                <li onClick={() => this.openUserCenter(PageEnum.userAccount.ucInfo)}>个人中心</li>
                <li onClick={e => { this._logout() } }>退出</li>
              </ul>
            </div>
          </a>

        </div>
      );
    }
  }

});

module.exports = LoginInfo;
