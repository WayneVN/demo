"use strict"
const React = require('react');
const Reflux = require('reflux');
import UserModal from '../model/mergerModal';
const LoginActions = require('../actions/LoginActions');
const _ = require('_');
const Loading = require('./loading.jsx');
import If from './If';

const LoginForm = React.createClass({
  mixins: [
    React.addons.LinkedStateMixin,
  ],
  getInitialState: function() {
    return {
      user:null,
      pwd:null,
      userError:null,
      pwdError:null,
      init:true,
      isLogin:true,
      forget:'',
      sendStatus:true
    };
  },
  onSend:function(e){
    e.preventDefault();
    var self =this;
    var check = this.validation();
    if (check) {
      this.setState({init:false});
      new UserModal().login({uname:this.state.user,pwd:this.state.pwd},function(data){
        if (data) {
          LoginActions.setUser(data);
          self.props.close();
        } else {
          self.setState({init:true,pwdError:'账号密码错误！'});
        }
      });
    }
  },
  validation:function(){
    var _this = this;
    var count =0;
    if (_.isNull(this.state.user) || _.isUndefined(this.state.user) || this.state.user.length ==0) {
      _this.setState({userError:'用户名不可为空'});
    } else {
      if (this.state.user.length >= 2) {
        _this.setState({userError:null});
        count++;
      } else {
        _this.setState({userError:'用户名长度不得短于2位'});
      }
    }
    if (_.isNull(this.state.pwd) || _.isUndefined(this.state.pwd) || this.state.pwd.length ==0) {
      _this.setState({pwdError:'密码不可为空'});
    } else {
      if (this.state.pwd.length >= 6) {
        _this.setState({pwdError:null});
        count++;
      } else {
        _this.setState({pwdError:'密码长度不得短于6位'});
      }
    }
    return count === 2 ;
  },
  // 忘记密码
  onForget:function(){
    this.setState({
      isLogin:false
    });
  },
  valdation_email:function(email){
    const regEmail = /\w@\w*\.\w/;
    let count = 0;
    if (_.isNull(email) || _.isUndefined(email) ||email.length==0 ) {
      this.setState({forgetError:'邮箱地址不可为空'});
    }else {
      this.setState({forgetError:null});
      count++;
    }
    if (!regEmail.test(email)) {
      this.setState({forgetError:'邮箱地址格式有误'});
    }else {
      this.setState({forgetError:null});
      count++;
    }
    return count;
  },
  // 发送密码到邮箱
  onSendEmail:function(e){
    e.preventDefault();
    let forget = this.state;
    if (_.isNull(forget) || _.isUndefined(forget) || forget.length ==0) {
      this.setState({
        forgetError:'不可为空'
      });
    } else {
      let count = this.valdation_email(this.state.forget);
      if (count ==2) {
        this.setState({
          sendStatus:false
        });
        UserModal.applyReset(this.state.forget,data=>{
          this.setState({
            sendStatus:true
          });
          if (data.status) {
            alert('新密码已发送至您的邮箱，请至邮箱查收。');
          } else {
            alert(data.message);
          }
        })
      }
    }
  },
  onReg:function(){
    this.props.reg();
  },
  render:function(){
    return this.state.isLogin?(
      <form className='forms'>
        <div className="form-head">
          <p className="form-title">
            <span className="title">登录</span>
            <br />
            <span className="smail">LOGIN</span>
          </p>
          <div className="form-hr"></div>
        </div>
        <div className="form-line required">
          <input type="text" className={this.state.userError ==null?"form-input ":"form-input error"} placeholder="手机号/邮箱" valueLink={this.linkState('user')} required/>
          <p className="invalid-prompt">{this.state.userError}</p>
        </div>
        <div className="form-line required ">
          <input type="password" className={this.state.pwdError ==null?"form-input ":"form-input error"} placeholder="密码" valueLink={this.linkState('pwd')} required/>
          <p className="invalid-prompt">{this.state.pwdError}</p>
        </div>
        <div className="form-line form-link">
          {
            //<label htmlFor="xy" className='form-label fll' onClick={this.onForget}>忘记密码</label>
          }
          <label className='form-label flr' onClick={this.onReg} >立即注册</label>
        </div>
        <If when = {this.state.init}>
          <button className="btn-full-org"  onClick={this.onSend}>登录</button>
        </If>
        <If when = {!this.state.init}>
          <Loading />
        </If>
        {/*
        <div className="form-footer">
          <p className="form-title">其他方式</p>
          <div className="form-hr"></div>
            <ul className="form-sso">
              <li>
                <ul className="form-btn-wechat" onClick={this.weChatLogin} style={{marginLeft:60}}>
                  <li><img src="../../images/weixincaise.png" alt="wechat" /></li>
                  <li>微信登录</li>
                </ul>
              </li>

                <li>
                  <ul className="form-btn-qq">
                    <li><img src='../../images/QQ2.png' alt="wechat" /></li>
                    <li>QQ登录</li>
                  </ul>
                </li>

            </ul>
        </div>
        */}
      </form>
    ):(
      <form className='forms'>
        <div className="form-head">
          <p className="form-title">
            <span className="title">忘记密码</span>
            <br />
            <span className="smail">FORGET</span>
          </p>
          <div className="form-hr"></div>
        </div>
        <div className="form-line required">
          <input type="email" className="form-input" placeholder="请填写绑定的邮箱" valueLink={this.linkState('forget')} required/>
          <p className="invalid-prompt">{this.state.forgetError}</p>
        </div>
        <If when = {this.state.sendStatus}>
          <button className="btn-full-org"  onClick={this.onSendEmail}>将密码发送至邮箱</button>
        </If>
        <If when = {!this.state.sendStatus}>
          <Loading />
        </If>
      </form>
    );
  }
});

module.exports = LoginForm;
