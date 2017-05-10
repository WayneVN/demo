/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "个人中心－个人资料"
 *
 * 上级传递 userInfo
 */

var React = require('react');
var pageEnum = require('../../../util/pageEnum');
var If = require('../../../component/if');
var MergerModal = require('../../../model/mergerModal').default;
var LoginActions = require('../../../actions/LoginActions');
var AlertActions = require('../../../actions/AlertActions');
var DialogAction = require('../../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var UcInfo = React.createClass({

  propTypes: {
    userInfo: React.PropTypes.object.isRequired,
    page: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return{
      userInfo: this.props.userInfo, //用户信息
      page: this.props.page, //显示页面
      email: this.props.userInfo.email,

      isEditUserName: false,
      isEditEmail: false,
      errorMsg: '',//修改密码提示信息
    }
  },

  render() {
    let {page, userInfo} = this.state;
    let {ucInfo, ucMdfPWD} = pageEnum.userAccount;

    return(
      <div className="uc-panel-body">
      <div className="uc-left-menu">
        <ul className="uc-nav">
          <li className= {page == ucInfo ? 'uc-left-active' : '' }  onClick= {() => this.setState({page: ucInfo})}>个人资料</li>
          <If when ={userInfo.has_pwd}>
            <li className= {page == ucMdfPWD ? 'uc-left-active' : '' } onClick= {() => this.setState({page: ucMdfPWD})}>修改密码</li>
          </If>
        </ul>
      </div>

        <div className="uc-right-content">
          <If when = {page == ucInfo} >
            {this.renderInfo()}
          </If>

          <If when = {page == ucMdfPWD} >
              {this.renderMdfPwd()}
          </If>

        </div>
      </div>
      )

  },

  //个人资料
  renderInfo() {
    let {userInfo, isEditUserName, isEditEmail, username, errorMsg, email} = this.state;

    return(
      <div>
        <div className="uc-row">
          <label className="uc-row-title fwn" for="l1">
            用户名
          </label>

          <If when = {!isEditUserName} >
           <div>
              <p className="uc-row-text">
                {userInfo.username}
              </p>
              <input className="uc-btn ml47" type="button" value="修改"
                     onClick= {() =>{this.setState({isEditUserName: true, username : userInfo.username})}}
              />
           </div>
          </If>

          <If when = {isEditUserName} >
            <div>
              <input className="uc-row-input" type="text" name="username" value= {username} onChange={this.setUSERValue} />
              <input className="uc-btn ml47" type="button" value="确认" onClick= {this.updateUserName} />
            </div>
          </If>
        </div>


        <If when = {userInfo.phone} >
        <div className="uc-row">
            <label className="uc-row-title fwn" for="l1">
            手机号
            </label>
            <p className="uc-row-text">
              {userInfo.phone}
            </p>
        </div>
        </If>

        <div className="uc-row">
           <label className="uc-row-title fwn" for="l3">
            邮箱号
            </label>

            <If when= {isEditEmail || (userInfo.email && userInfo.email_verified != 1) } >
              <div>
                <input className="uc-row-input" type="text" name ='email' value= {email} onChange={this.setUSERValue} />
                <input className="uc-btn ml47" type="button" value="确认" onClick= {this.sendEmail}/>
                <If when = {userInfo.email && userInfo.email_verified == 2 }>
                  <div className="uc-row-msg mt10 fs14">
                  请登录{userInfo.email}收取激活邮件,激活后可使用该邮箱登录
                  </div>
                </If>
              </div>
            </If>

            <If when = {userInfo.email && userInfo.email_verified == 1} >
              <p className="uc-row-text">
                {userInfo.email}
              </p>
            </If>

            <If when= {!userInfo.email && !isEditEmail} >
              <a  href="javascript:;" className="uc-row-msg mt5" onClick = {() => {this.setState({isEditEmail: true})}}>请添加邮箱</a>
            </If>
        </div>


     </div>
    )

  },

  //密码修改
  renderMdfPwd() {
    let {userInfo, pwd, npwd, rnpwd, errorMsg} = this.state;
    return (
      <div>
        <div className="uc-row">
          <label className="uc-row-title fwn" for="l1">
            原密码
          </label>
          <input className="uc-row-input" type="password" name ='pwd' value= {pwd} onChange={this.setUSERValue} />
        </div>
        <div className="uc-row">
          <label className="uc-row-title fwn" for="l1">
            新密码
          </label>
          <input className="uc-row-input" type="password" name ='npwd' value= {npwd} onChange={this.setUSERValue} />
        </div>
        <div className="uc-row">
          <label className="uc-row-title fwn" for="l1">
            确认密码
          </label>
          <input className="uc-row-input" type="password" name ='rnpwd' value= {rnpwd} onChange={this.setUSERValue} />

          <span className="uc-row-error">{errorMsg}</span>
        </div>

        <div className="uc-row mb0">
          <label className="uc-row-title fwn">&nbsp;</label>
          <a className="uc-btn"  onClick= {this.updatePwd} >确认</a>
        </div>
      </div>
    )
  },

  //跟新用户名
  updateUserName(){
    let {userInfo,username} = this.state;

    if(!username) {
      AlertActions.error('用户名不能为空','修改用户名');
      return;
    }

    this.setState({
      isEditUserName:false,
    },()=>{
      new MergerModal().updateUserName(username,data=>{
        if (data.status) {
          userInfo.username = username;
          this.setState({
            userInfo:userInfo
          },()=>{
            LoginActions.Replace(this.state.userInfo);
            AlertActions.success(data.msg,'修改成功');
            DialogAction.close();
          });
        } else {
          this.setState({username: null}, () => {
            AlertActions.error(data.msg,'修改失败');
          });
        }
      });
    });
  },

  // 发送验证邮件
  sendEmail(e)  {
    let {email, userInfo} = this.state;
    if(!email) {
      AlertActions.error('请填写邮箱','失败');
      return;
    }
    if(!/\w@\w*\.\w/.test(email)) {
      AlertActions.error('请填写正确邮箱','失败');
      return;
    }

    new MergerModal().emailVerify({email_address: email},data=>{
      if (data.status) {
        AlertActions.success(data.message,'邮件验证发送成功');
        DialogAction.close();
        userInfo.email = email;
        userInfo.email_verified = 2;
        this.setState({
          isEditEmail:false,
          userInfo: userInfo,
        });
      }else {
        AlertActions.error(data.message,'邮件验证发送失败');
      }
    });
  },

  //设置state USER值
  setUSERValue: function(e) {
    var data ={};
    var name = e.currentTarget.attributes.name.value,
      value = e.target.value;

    data[name] = value.trim();
    this.setState(data);

  },


  updatePwd(){
    let {pwd, npwd, rnpwd} = this.state;

    let errorMsg = '';

    if(!pwd || !npwd || !rnpwd) {
      errorMsg ='请填写所有资料';
    }else if(npwd !== rnpwd) {
      errorMsg = '两次密码输入不一致';
    }else if(npwd.length < 6 ) {
      errorMsg = '密码不少于6个字符';
    }

    this.setState({errorMsg : errorMsg});
    if(errorMsg) {
      return;
    }

    let obj = {
      'ModifyPasswordForm[password]': pwd,
      'ModifyPasswordForm[new_password]': npwd,
      'ModifyPasswordForm[new_password_repeat]': rnpwd
    };
    new MergerModal().updatePassword(obj,data=>{
      if (data.status) {
        AlertActions.success('修改成功','修改密码');
        DialogAction.close();
        this.setState({
          password:null,
          new_password:null,
          new_password_repeat:null,
        });
      } else {
        AlertActions.error(data.msg.error,'修改密码');
      }
    });
  },

  onKey(e) {
    const ENTER_KEY = 13;
    if (e.keyCode === ENTER_KEY) {
      this._updatePwd();
    }
  },


});

module.exports = UcInfo;
