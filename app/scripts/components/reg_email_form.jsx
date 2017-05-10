"use strict"
/**
 * 注册－邮箱注册-默认
 */
var React = require('react');
var _ =require('_');
var Loading = require('./loading');
import UserModal from '../model/mergerModal';
var LoginActions = require('../actions/LoginActions');
var RegEmailForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      email:null,
      emailError:null,
      pwd:null,
      pwdError:null,
      repwd:null,
      repwdError:null,
      init:true,
      yqmError:null,
      yqm:null,
      codeError:null,
    };
  },
  validation:function(){
    var _this = this;
    var count =0;
    var regEmail = /\w@\w*\.\w/;
    if (_.isNull(this.state.email) || _.isUndefined(this.state.email) ||this.state.email.length==0 ) {
      _this.setState({emailError:'邮箱地址不可为空'});
    }else {
      _this.setState({emailError:null});
      count++;
    }
    if (!regEmail.test(this.state.email)) {
      _this.setState({emailError:'邮箱地址格式有误'});
    }else {
      _this.setState({emailError:null});
      count++;
    }
    // if (_.isNull(this.state.yqm) || _.isUndefined(this.state.yqm) || this.state.yqm.length < 1) {
    //   _this.setState({yqmError:'邀请码不得为空'});
    // }else {
    //   _this.setState({yqmError:null});
    //   count++;
    // }
    if (_.isNull(this.state.pwd) || _.isUndefined(this.state.pwd) || this.state.pwd.length < 6) {
      _this.setState({pwdError:'密码长度不得短于6位'});
    } else {
      _this.setState({pwdError:null});
      count++;
    }
    if (_.isNull(this.state.repwd) || _.isUndefined(this.state.repwd) || this.state.repwd.length < 6) {
      _this.setState({repwdError:'密码长度不得短于6位'});
    } else {
      _this.setState({repwdError:null});
      if (this.state.repwd ===this.state.pwd ) {
        _this.setState({repwdError:null});
        count++;
      } else {
        _this.setState({repwdError:'两次密码不一致'});
      }
    }
    return count === 4;

  },
  onSend:function(e){
    e.preventDefault();
    var self = this;
    var check = this.validation();
    if (check) {
      this.setState({init:false});
      new UserModal().signup({uname:this.state.email,pwd:this.state.pwd,repwd:this.state.repwd},function(data){
        var result ;
        if (data.status) {
          new UserModal().login({uname:self.state.email,pwd:self.state.pwd},function(data){
              LoginActions.setUser(data);
          });
          self.setState({init:true});
          self.props.checkReg('SUCCESS_EMAIL');
        } else {
          self.setState({init:true,repwdError:data.error_msg});
        }
      });
    }
  },
  onLinkTel:function(){
    this.props.checkReg('RegTelForm');
  },
  render:function(){
    return (
            <form className='forms'>
              <div className="form-head">
                <p className="form-title">
                  <span className="title">邮箱注册</span>
                  <br />
                  <span className="smail">SIGN&nbsp;UP</span>
                </p>
                <div className="form-hr"></div>
              </div>
              <div className="form-line ">
                <input type="email" className={this.state.emailError ==null?"form-input ":"form-input error"} placeholder="邮箱地址"  valueLink={this.linkState('email')} required/>
                <p className="invalid-prompt">{this.state.emailError}</p>
              </div>
              <div className="form-line  ">
                <input type="password" className={this.state.pwdError ==null?"form-input ":"form-input error"}  placeholder="密码" valueLink={this.linkState('pwd')}  required/>
                <p className="invalid-prompt">{this.state.pwdError}</p>
              </div>
              <div className="form-line  ">
                <input type="password" className={this.state.repwdError ==null?"form-input ":"form-input error"} placeholder="确认密码" valueLink={this.linkState('repwd')}  required/>
                <p className="invalid-prompt">{this.state.repwdError}</p>
              </div>
              {/*
                <div className="form-line  ">
                  <input type="test" className={this.state.yqmError ==null?"form-input ":"form-input error"} placeholder="请输入您的邀请码" valueLink={this.linkState('yqm')}  required/>
                  <p className="invalid-prompt">{this.state.yqmError}</p>
                </div>
                */}
              <div className="form-line form-link">
                <input type="checkbox" id="xy" className='form-check'  checked disabled />
                <label htmlFor="xy" className='form-label'>同意九斗服务协议</label>
              </div>


              {this.state.init?<button className="btn-full-org" onClick={this.onSend} >立即注册</button>:<Loading />}
                <div className="form-footer">
                  <p className="form-title">其他方式</p>
                  <div className="form-hr"></div>
                  <ul className="form-sso">
                    {/*
                      <li>
                        <ul className="form-btn-wechat">
                          <li><img src="../../images/weixin1.png" alt="qq" /></li>
                          <li>微信登录</li>
                        </ul>
                      </li>
                      */}
                    <li>
                      <ul className="form-btn-qq" onClick={this.onLinkTel} style={{marginLeft:60}}>
                        <li><img src='../../images/phone.png' alt="wechat" /></li>
                        <li>手机注册</li>
                      </ul>
                    </li>
                  </ul>
                </div>
            </form>
    );
  }
});

module.exports = RegEmailForm;
