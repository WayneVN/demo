"use strict"
var React = require('react');
var Reflux = require('reflux');
var LoginInfo = require('./loginInfo');
var If = require('./if');

import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
var AlertStore = require('../store/alertStore');
var HeadStore = require('../store/headStore');
var LoginStore = require('../store/loginStore');
var TeachStore = require('../store/teachStore');
var ScopeStore = require('../store/scopeStore');

var DialogAction = require('../action/dialogAction');
var Dialog = DialogAction.Dialog;
var ScopeActions = require('../action/scopeAction');
var _ = require('_');
var PageEnum = require('../bizComponent/userCenter/config');
var UserCenter = require('../bizComponent/userCenter/userCenter');
var Login = require('../bizComponent/login/login');

import UserModal from '../model/userModel';
const Model = new UserModal();
const moment = require('moment');

const Header = React.createClass({
  mixins: [
    Reflux.listenTo(AlertStore, '_alert'),
    Reflux.listenTo(HeadStore, 'headHandler'),

    Reflux.connectFilter(LoginStore,'userInfo',function(userInfo) {
      if(_.isEmpty(this.state.userInfo)){
        //获取个人积分
        ScopeActions.getScope();
        //因为后台是一个小时更新统计一次积分数,前端目前也进行一个定时器管理
        if(!this.state.scopeTime) {
          let scopeTime = setInterval(() => {ScopeActions.getScope()} , 60 * 60 *1000);
          this.setState({scopeTime: scopeTime});
        }
      }

      return userInfo;
    }),
    Reflux.connect(ScopeStore,'userScope'),
    Reflux.connectFilter(TeachStore,'closeBanner',function(data) {
      this.setState({closeBanner: data, bigBanner: !data});
      return data;
    }),
  ],

  getInitialState: function() {
    return {
      searchKey: null,
      radioKey: 'filter',
      open: false,
      isIcon: true,
      userInfo:{},
      userScope: {},// 用户积分
      showBottomBanner: false,
      closeBanner: false,
      bigBanner: this.isHome(), //首页才有大banner
      scopeTime: null,//个人积分定时器
    };
  },

  componentDidMount: function () {

    if (!this.props.noNeedLogin) {
      Model.userinfo();
    }
    let is = $.cookie('showBottomBanner');
    let now = moment().format('L');
    let {
      location: {
        hash
      }
    } = window;
    if (hash.split('/')[1] == 'account') {
      
      if (!is) {
        this.setState({
          showBottomBanner: true
        }, () => {
          $.cookie('showBottomBanner', now , { expires: 365, path: '/' });
        });
      }
      else {
        let val = $.cookie('showBottomBanner');
        if (val == now) {
          this.setState({showBottomBanner: false});
        }
        else {
          this.setState({showBottomBanner: true});
        }
      }
      setTimeout(() => {
        this.setState({showBottomBanner: false});
      }, 15*1000);
      $.cookie('showBottomBanner', now , { expires: 365, path: '/' });
    }
    
  },

  _alert: function(type, title, msg, format) {
    this.refs.container[type](title, msg, format);
  },

  handleFocus: function() {
    this.setState({isIcon: false})
  },

  handleBlur: function() {
    this.setState({isIcon: true})
  },

  headHandler: function (type, data) {
    var me = this;

    if (type == 'page') {
      me.openUserCenter(data);
    }
    else if (type == 'position') {
      me.setPosition(data);
    }
  },

  openUserCenter: function (page) {
    if(_.isEmpty(this.state.userInfo)){
      DialogAction.open(Dialog.WechatLogin);
    }else{

      DialogAction.open(Dialog.UserCenter,{
        page: page,
        userInfo: this.state.userInfo,
        userScope: this.state.userScope,
      })
    }
  },

  setPosition: function (position) {
    var me = this;
    var element = me.refs.header.getDOMNode();

    $(element)
      .css('position', position ? position : $(element).data('position'))
      .css('top', '0');
  },


  closeBanner() {
    if(!_.isEmpty( this.state.userInfo) && this.state.bigBanner){
      var time = 15* 1000;
      setTimeout(() => { this.setState({closeBanner: true}); } , time);
      setTimeout(()=> this.setState({bigBanner: false}), time+3* 1000);
    }
  },

  loginOpenBanner(e) {
    $.cookie('showBottomBanner', '');
    DialogAction.open(Dialog.WechatLogin);
  },

  //登录后小head
  renderHeader() {
    return (
      <nav className="header jd-head" data-position="" ref="header">
        <ToastContainer ref="container" toastMessageFactory={ToastMessageFactory} className="toast-top-right"/>
        <div className="header-warp">
          <a href="#/" className="link-logo"><img src="/images/logo.png" alt="logo"/></a>
          {this.renderNav()}
        </div>
      </nav>
    );
  },

  //绘画个人解锁等信息
  renderMsgImg() {
    let {
      closeBanner,
      userInfo:{
        latest_login_date, // 最近登录日期
        accumulative_login_times, // 累计登录天数
        successive_login_times, // 连续登录的天数
        lock_value, // 解锁信息 0 未解锁 1 解锁内部交易 2 并购重组,
        unlock_time,// 全部解锁时间
        }
      } = this.state;

    let noLogin = _.isEmpty( this.state.userInfo);

    let msgClass = 'msg ';

    if(noLogin){
      msgClass += ' msg-nologin';
      return <div className={msgClass}>&nbsp;</div>
    }



    let day = accumulative_login_times ? accumulative_login_times : '0';

    if(accumulative_login_times < '1') {
      msgClass += `  msg-0`;
    }else{
      if(lock_value == '0') {
        msgClass += ` msg-1`;
      }else if(lock_value == '1') {
        msgClass += ` msg-2`;
      }else if(lock_value == '2' && new Date().Format('yyyyMMdd') == unlock_time) {
        msgClass += ` msg-3`;
      }
    }

    return(
      <div>

        <p className="head-msg">
          累计登录
          <span className="day">
            {accumulative_login_times?accumulative_login_times :'0'}
          </span>
          天 连续登录
          <span className="day">
            {successive_login_times? successive_login_times:'0'}
          </span>
          天
        </p>
        <div className={msgClass}>&nbsp;</div>
      </div>
    );
  },


  renderBigBanner() {

    let {
      closeBanner,
      userInfo:{
        latest_login_date, // 最近登录日期
        accumulative_login_times, // 累计登录天数
        successive_login_times, // 连续登录的天数
        lock_value, // 解锁信息 0 未解锁 1 解锁内部交易 2 并购重组,
        unlock_time,// 全部解锁时间
        },
      } = this.state;

    let bannerClazz =!closeBanner? 'bigBanner ' : 'bigBanner banner-colse ';
    bannerClazz += ' bigBanner'+new Date().getDay();

    if(lock_value == '0' && !closeBanner){
      bannerClazz += ' jd-header300';
    }

    let logoClazz = !closeBanner? 'nologin-link-logo ' : 'nologin-link-logo link-logo-close ';

    let headerClazz = !closeBanner? 'header headerBottom ' :'header  header-close ';
    return (
      <div className="jd-head">
        <div className={bannerClazz}>
          <div className="user-msg">
            <div className="logoDiv">
              <a href="#/" className= 'nologin-link-logo ' >
                <i className="iconfont icon-logo"></i>
              </a>
            </div>

            {this.renderMsgImg()}
           </div>
          <div className='header headerBottom '>
            <ToastContainer
                ref="container"
                toastMessageFactory={ToastMessageFactory}
                className="toast-top-right"
            />
            <div className="header-warp">
              {this.renderNav()}
            </div>
          </div>

          <div className="header-rigth">
            <LoginInfo open={this.state.open} userInfo = {this.state.userInfo}
                   userScope ={this.state.userScope} />
          </div>

        </div>
      </div>
    );
  },

  renderNav() {
    let [
      list,
      contrastClazz,
      msgClazz,
      ] = [[], '', '', window.location.hash];
    var {
      props: {
        type,
        item
      }
    } = this;

    let navClazz = type == 'small' ? 'nav-menu' : 'nav-menu nav-menu-big';
    
    let isShow = true;
    var hash = window.location.hash;

    if (hash == '#/' || hash.split('/')[1] != 'account') {
      isShow = false;
    }

    return(
      <div className="por">
        <ul className={navClazz}>
          <li>
            <a href="/">&nbsp;&nbsp;首&nbsp;&nbsp;页&nbsp;&nbsp;</a>
          </li>
          <li className="por">
            <a href="/#/account">&nbsp;交易追踪&nbsp;</a>
          </li>
          <li>
            <a href="/#/campIndex">&nbsp;训&nbsp;练&nbsp;营&nbsp;</a>
          </li>
          <li>
            <a href="/msgList.html" className={msgClazz} >&nbsp;消息神器&nbsp;</a>
          </li>

        </ul>

        <div className="login-area">
          <LoginInfo open={this.state.open} userInfo = {this.state.userInfo}
                     userScope ={this.state.userScope} />
        </div>

      </div>
    )
  },

  recordClick() {
    this.setState({
      showBottomBanner: false
    });
  },
  
  renderBottomBanner() {
    let {
      state: {
        showBottomBanner = false,
        userInfo
      }
    } = this;
    let {
      location: {
        hash
      }
    } = window;
    if (!showBottomBanner || hash!= '#/account') {
      return (
        <noscript />
      )
    }

    return (
      <div className="bottom-banner">
        <div className="bottom-banner-mark" />
        <div className="bottom-banner-warp">
          {/* <img className="img-close"
              onClick={e=>{this.recordClick(e)}}
              src="http://onb7pfrdl.bkt.clouddn.com/img-close.png"/> */}
          <img className="img-bbhj" src="http://onb7pfrdl.bkt.clouddn.com/bbhj.png"/>
          <img className="img-bbtext" src="http://onb7pfrdl.bkt.clouddn.com/bb-text.png"/>
          <img className="img-erweima" alt="" src="http://onb7pfrdl.bkt.clouddn.com/bb-erweima.png"/>
          <img className="img-bbright" src="http://onb7pfrdl.bkt.clouddn.com/bb-right.png"/>
          {
            userInfo.user_id?
            <a className="btn-warp"
               href="#/account/diagnosed"
               target="_blank"
            >&nbsp;</a>:
            <a className="btn-warp"
               href="javascript:;"
               onClick={event => {this.loginOpenBanner(event)}}
            >&nbsp;</a>
          }
        </div>
      </div>
    );
  },

  render() {
    this.closeBanner();

    //导航条因为布局不合理,导致了renderBigBanner和 renderHeader ,如果布局合理后,这两个方法可以合并,减少逻辑
    return (
      <div>
        <If when={this.state.bigBanner}>
          {this.renderBigBanner()}
        </If>

        <If when={!this.state.bigBanner}>
          {this.renderHeader()}
        </If>

        {this.renderBottomBanner()}
        <UserCenter />
        <Login />
      </div>
    )
  },

  //是首页
  isHome () {
    return this.props.type == 'big';
  }

});

module.exports = Header;
