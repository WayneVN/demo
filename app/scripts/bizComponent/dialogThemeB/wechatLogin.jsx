"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: "wechat"
 */

var React = require('react');
var MergerModal = require('../../model/mergerModal').default;
var format = require('../../util/format');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeB = require('../../component/dialogThemeB');
const Modal = new MergerModal();
const LoginActions = require('../../actions/LoginActions');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var WechatLogin = React.createClass({

  getInitialState() {
      return({
        wechatSrc:'',
        isLoad:true,
        time: true,
      });
  },

  componentDidMount(){
    let {origin} = window.location;
    Modal.wechatParams(data=>{
      this.WxLogin({
        appid: data.appid,
        redirect_uri:data.redirect_uri,
        state:data.state,
      });
    });
  },

  checkUser() {
    new MergerModal().userinfo((data) => {
      if (data.status) {
        Modal.sendRegisterLog();
        LoginActions.userInfo();
        setTimeout(function(){
          window.location.reload();
        }, 500)
      }else if(this.state.time){
        setTimeout(this.checkUser, 500);
      }
    });
  },


  WxLogin(obj){
    /*  转马了两次 */
    let _encode = `${encodeURIComponent(window.location.hash)}`;
    let encode  = `${obj.redirect_uri}${encodeURIComponent('/' + _encode)}`;
    let url =`https://open.weixin.qq.com/connect/qrconnect?
      appid=${obj.appid}
      &scope=snsapi_login
      &redirect_uri=${encode}
      &state=${obj.state}
      &login_type=jssdk
      &style=black
      &href=`;
    this.setState({
      wechatSrc:format.Trim(url,'g'),
      isLoad:false
    });
  },

  render() {
    let {isLoad} =this.state;
    return (
      <DialogThemeB>
        <DialogThemeB.Body className="modal-body center">
          <form className='forms'>
            <div className="form-head">
              <p className="form-title">
                <span className="title">微信登录</span>
                <br />
                <span className="smail">WECHAT&nbsp;LOGIN</span>
              </p>
              <div className="form-hr" />
            </div>
            <If when={!isLoad}>
              <iframe src={this.state.wechatSrc} frameBorder="0" scrolling="no" width="300" height="400"  style={{marginTop:-80}}/>
            </If>
            <If when={isLoad}>
              <Loading />
            </If>

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
                  <ul className="form-btn-qq" onClick={e =>{DialogAction.open(Dialog.Login)}} style={{marginLeft:10,marginTop:50,}}>
                    <li><img src='../../images/phone.png' alt="wechat" /></li>
                    <li>普通登录</li>
                  </ul>
                </li>
              </ul>
            </div>
            {/*
             <div className="form-footer" style={{marginTop:0}}>
             <div className="form-hr"></div>
             <ul className="form-sso">
             <li>
             <ul className="form-btn-wechat">
             <li><img src="../../images/weixin1.png" alt="qq" /></li>
             <li>微信登录</li>
             </ul>
             </li>
             <li>
             <ul className="form-btn-qq" onClick={this.onLinkTel} style={{marginLeft:60}}>
             <li><i className="fa fa-reply" style={{fontSize:30}}/></li>
             <li>返回其他登录</li>
             </ul>
             </li>
             </ul>
             </div>
             */}
          </form>
        </DialogThemeB.Body>
      </DialogThemeB>
    );
  },


});

module.exports = WechatLogin;
