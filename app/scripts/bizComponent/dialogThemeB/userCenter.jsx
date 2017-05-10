"use strict"
var React = require('react');
var Reflux = require('reflux');
var LoginActions = require('../../actions/LoginActions');
var If = require('../../component/if');
var MergerModal = require('../../model/mergerModal').default;
const DialogThemeA = require('../../component/dialogThemeA');
var AlertActions = require('../../actions/AlertActions');
var UcInfo = require('./userCenter/ucInfo');
var UcFeedback = require('./userCenter/ucFeedback');
var UcScope = require('./userCenter/ucScope');
var UcDoumi = require('./userCenter/ucDoumi');
var UcSetting = require('./userCenter/ucSetting');
var UcLottery = require('./userCenter/ucLottery');
var PageEnum = require('../../util/pageEnum');
var logger = require('../../util/logger');

const { //个人中心
        ucInfo,//个人资料
        ucMdfPWD,//密码修改
        integral,//个人积分
        feedback,//意见反馈
        message,//站内信
        doumi,
        lottery, //奖券
        setting
} = PageEnum.userAccount;

var UserCenter = React.createClass({

  getInitialState(){
    return({
      userInfo:this.props.userInfo,
      page: this.props.page || PageEnum.userAccount.ucInfo,
      userScope: this.props.userScope,
    });
  },

  componentDidMount: function() {
    this.sendLog();
  },


  sendLog() {
    let nav = this.getNav();
    let _target = '';

    if(nav == ucInfo) {
      _target = 'uc.info'; //个人信息
    }else if(nav == integral) {
      _target = 'uc.score'; // 个人积分
    }else {
      _target = 'uc.feedback'; //站内信
    }

    // logger.log({
    //   target: 'uc_index_pv'
    // });

    logger.log({
      target: _target
    });
  },

  onChangePage(page) {
    this.setState({page: page}, () => {this.sendLog()});
  },

  //获取子大类
  getNav() {

    let {page, userInfo, userScope} = this.state;

    let nav;

    switch(page) {
      case ucInfo :
      case ucMdfPWD:
        nav = ucInfo;
        break;
      case doumi:
      case integral:
      case lottery:
      case setting:
        nav = integral; 
        break;
      case feedback :
      case message :
        nav = feedback;break;
    }

    return nav;
  },

  transfer: function (param) {
    this.setState(param);
  },

  render() {

    let {page, userInfo, userScope} = this.state;

    let nav = this.getNav();

    return (
        <DialogThemeA title={'个人中心'} >
          <div className="uc-panel">
            <div className="uc-panel-title">
              <ul className="uc-nav">
                <li className={nav == ucInfo ? 'uc-nav-active' : ''}  onClick= {() => this.onChangePage(ucInfo)}>个人信息</li>
                <li className={nav == integral ? 'uc-nav-active' : ''} onClick= {() => this.onChangePage(integral)}>我的账户</li>
                <li className={nav == feedback ? 'uc-nav-active' : ''} onClick= {() => this.onChangePage(feedback)}>意见反馈</li>
              </ul>
            </div>


            <If when = {nav == ucInfo} >
              <UcInfo page = {page} userInfo ={userInfo}  />
            </If>

            <If when = {page == integral} >
                <UcScope userScope= {userScope} transfer={this.transfer}/>
            </If>

            <If when={page == doumi}>
                <UcDoumi transfer={this.transfer}/>
            </If>

            <If when={page == setting}>
                <UcSetting transfer={this.transfer}/>
            </If>

            <If when={page == lottery}>
                <UcLottery transfer={this.transfer}/>
            </If>

            <If when = {nav == feedback} >
              <UcFeedback page = {page} userInfo ={userInfo} />
            </If>

            </div>

        </DialogThemeA>
    )
  },



});

module.exports = UserCenter;

