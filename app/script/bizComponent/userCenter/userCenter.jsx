"use strict"
var React = require('react');
var Reflux = require('reflux');
var LoginActions = require('../../action/loginAction');
var If = require('../../component/if');
const DialogThemeA = require('../../component/dialogThemeA');
var AlertActions = require('../../action/alertAction');
var UcInfo = require('./ucInfo');
var UcFeedback = require('./ucFeedback');
var UcScope = require('./ucScope');
var UcDoumi = require('./ucDoumi');
var UcLottery = require('./ucLottery');
var UcSetting = require('./ucSetting');
var PageEnum = require('./config');
var logger = require('../../util/logger');
var _ = require('lodash');

var DialogStore = require('../../store/dialogStore');
var DialogAction = require('../../action/dialogAction');

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
    this.unDialogscribe = DialogStore.listen(this.dialogHandler);
    return({
      userInfo:this.props.userInfo,
      page: this.props.page || PageEnum.userAccount.ucInfo,
      userScope: this.props.userScope,
    });
  },

  dialogHandler: function (option) {
    var me = this;
    var temp;
    if (option[0] == DialogAction.Dialog.UserCenter) {
      temp = _.cloneDeep(option[1]);
      temp.show = true;
      me.setState(temp);
    }
    else {
      me.setState({
        show: false
      })
    }
  },

  componentDidMount: function() {
    this.sendLog();
  },

  componentWillUnmount(){
    this.unDialogscribe();
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

    let {page, userInfo, userScope, show} = this.state;

    let nav = this.getNav();

    return (
        <div>
          <If when={show}>
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

                <If when={page == lottery}>
                    <UcLottery transfer={this.transfer}/>
                </If>

                <If when={page == setting}>
                    <UcSetting transfer={this.transfer}/>
                </If>

                <If when = {nav == feedback} >
                  <UcFeedback page = {page} userInfo ={userInfo} />
                </If>

                </div>

            </DialogThemeA>
          </If>
        </div>
    )
  },



});

module.exports = UserCenter;

