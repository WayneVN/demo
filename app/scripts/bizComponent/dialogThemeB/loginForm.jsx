"use strict"
/**
 * 登录
 * @type {*|exports|module.exports}
 */
var React = require('react');
import UserModal from '../../model/mergerModal';
var LoginActions = require('../../actions/LoginActions');
const ReloadAction = require('../../actions/ReloadActions');
var _ = require('_');
var Loading = require('../../component/loading');
var If = require('../../component/if');
var DialogThemeB = require('../../component/dialogThemeB');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

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
        if (data.status && data.data) {
          ReloadAction.reload();
          LoginActions.setUser(data);
          DialogAction.close();
        } else {
          self.setState({init:true,pwdError:'用户名或密码错误,请重新输入！'});
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

  render:function(){
    return(
      <DialogThemeB>
        <DialogThemeB.Body className="modal-body center">
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

              <label className='form-label flr' onClick={e => {DialogAction.open(Dialog.RegEmailForm)}} >立即注册</label>
            </div>
            <If when = {this.state.init}>
              <button className="btn-full-org"  onClick={this.onSend}>登录</button>
            </If>
            <If when = {!this.state.init}>
              <Loading />
            </If>

          </form>
        </DialogThemeB.Body>
      </DialogThemeB>
    );

  }
});

module.exports = LoginForm;
