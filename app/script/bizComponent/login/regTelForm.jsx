"use strict"
/**
 * 注册－手机号注册
 */
var React = require('react');
require('react/addons');
var _ =require('_');
var Loading = require('../../component/loading');
import MergerModal from '../../model/userModel.js';
const Modal = new MergerModal();
var LoginActions = require('../../action/loginAction');
var DialogAction = require('../../action/dialogAction');
var Dialog = DialogAction.Dialog;
var DialogThemeB = require('../../component/dialogThemeB');

var RegTelForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      phone:null,
      phoneError:null,
      pwd:null,
      pwdError:null,
      repwd:null,
      repwdError:null,
      code:null,
      codeError:null,
      yqmError:null,
      yqm:null,
      init:true,
      disabled:false,
      time:60
    };
  },
  validation:function(){
    var _this = this;
    var count =0;
    var regMobile = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (_.isNull(this.state.phone) || _.isUndefined(this.state.phone) ||this.state.phone.length==0 ) {
      _this.setState({phoneError:'手机号码不可为空'});
    }else {
      _this.setState({phoneError:null});
      count++;
    }
    if (!regMobile.test(this.state.phone)) {
      _this.setState({phoneError:'手机号码格式有误'});
    }else {
      _this.setState({phoneError:null});
      count++;
    }

    if (_.isNull(this.state.pwd) || _.isUndefined(this.state.pwd) || this.state.pwd.length < 6) {
      _this.setState({pwdError:'密码长度不得短于6位'});
    } else {
      _this.setState({pwdError:null});
      count++;
    }
    // if (_.isNull(this.state.yqm) || _.isUndefined(this.state.yqm) || this.state.yqm.length < 1) {
    //   _this.setState({yqmError:'邀请码不得为空'});
    // }else {
    //   _this.setState({yqmError:null});
    //   count++;
    // }
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

    // if (_.isNull(this.state.code) || _.isUndefined(this.state.code) || this.state.code.length ==0) {
    //   _this.setState({codeError:'验证码不可为空'});
    // } else {
    //   _this.setState({codeError:null});
    //   count++;
    // }
    return count === 4;

  },
  onSend:function(e){
    e.preventDefault();
    var self = this;
    var check = this.validation();
    if (check) {
      this.setState({init:false});
      Modal.signup({uname:this.state.phone,pwd:this.state.pwd,repwd:this.state.repwd},function(data){
        var result ;
        if (data.status) {
          Modal.login({uname:self.state.phone,pwd:self.state.pwd},function(data){
              LoginActions.setUser(data);
          });
          self.setState({init:true});
          DialogAction.open(Dialog.Success);
        } else {
          self.setState({init:true,repwdError:data.error_msg});
        }
      });
    }
  },
  getCode:function(e){
    e.preventDefault();
    var _this = this;
    var _time = this.state.time;
    this.setState({disabled:true},function(){
      setTimeout(function(){
        _this.setState({disabled:false});
      },this.state.time*1000);
      var interval = setInterval(function(){
        if (_time>0) {
          _time--;
          _this.setState({time:_time});
        } else {
          clearInterval(interval);
          _this.setState({time:60});
        }
      },1000);
    });
  },

  render:function(){
    return (
      <DialogThemeB clazz="login-dialog">
        <DialogThemeB.Body className="modal-body center">
            <form className='forms'>
              <div className="form-head">
                <p className="form-title">
                  <span className="title">手机注册</span>
                  <br />
                  <span className="smail">SIGN&nbsp;UP</span>
                </p>
                <div className="form-hr"></div>
              </div>
              <div className="form-line ">
                <input type="text" className={this.state.phoneError ==null?"form-input ":"form-input error"} placeholder="手机号"  valueLink={this.linkState('phone')} required/>
                <p className="invalid-prompt">{this.state.phoneError}</p>
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
                  <input type="text" className={this.state.codeError ==null?"form-input-sm ":"form-input-sm error"} placeholder="验证码" valueLink={this.linkState('code')} required/>
                  <button className="btn-sm-green" disabled={this.state.disabled} onClick={this.getCode} >发送验证码</button>
                  <p className="invalid-prompt-sm">{this.state.codeError}</p>
                  <p className={this.state.disabled?'invalid-info':'hide'}>{this.state.time}秒后重发</p>
                </div>
              */}

              {this.state.init?<button className="btn-full-org" onClick={this.onSend} >立即注册</button>:<Loading />}
                <div className="form-footer">
                  <p className="form-title">其他方式</p>
                  <div className="form-hr"></div>
                  <ul className="form-sso">
                    {/*
                      <li>
                        <ul className="form-btn-wechat">
                          <li><img src="/images/weixin1.png" alt="qq" /></li>
                          <li>微信登录</li>
                        </ul>
                      </li>
                      */}
                    <li>
                      <ul className="form-btn-qq" onClick={e =>{DialogAction.open(Dialog.RegEmailForm)}} style={{marginLeft:10,marginTop:50,}}>
                        <li><img src='/images/mail.png' alt="emailReg" /></li>
                        <li>邮箱注册</li>
                      </ul>
                    </li>
                  </ul>
                </div>
            </form>
        </DialogThemeB.Body>
      </DialogThemeB>
    );
  }
});

module.exports = RegTelForm;
