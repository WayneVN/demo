import React,{Component} from 'react';
import LoginActions from '../actions/LoginActions';
import LoginStore from '../stores/LoginStore';
import If from './If';
import UserModal from '../model/mergerModal';
import ReactToastr ,{ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import Tooltip from 'rc-tooltip';

export default class UserCenter extends Component{
  constructor(props) {
    super(props);
  }
  state = {
    userInfo:this.props.userInfo,
    isUser:false,
    isEmail:false,
    isPwd:false,
    isUc:true,//默认显示个人资料
  }
  componentDidMount() {
  }
  updateUser = (e) =>{
    e.preventDefault();
    this.setState({isUser:true});
  }
  updateEmail =(e)=>{
    e.preventDefault();
    this.setState({
      isEmail:true,
      newEmail:this.state.userInfo.email
    });
  }
  cancelUser =(e)=>{
    e.preventDefault();
    this.setState({
      isUser:false,
    });
  }
  sendUser =(e)=>{
    e.preventDefault();
    this.setState({
      isUser:false,
    },()=>{
      new UserModal().updateUserName(this.state.username,data=>{
        if (data.status) {
          let u = this.state.userInfo;
          u.username = this.state.username;
          this.setState({
            userInfo:u
          },()=>{
            LoginActions.Replace(this.state.userInfo);
            this._alert('success',data.msg,'修改成功');
          });
        } else {
          this._alert('error',data.msg,'修改失败');
        }
      });
    });
  }
  cancelEmail =(e)=>{
    e.preventDefault();
    this.setState({
      isEmail:false,
    });
  }
  // 发送验证邮件
  sendEmail =(e)=>{
    e.preventDefault();
    let {newEmail} = this.state;
    UserModal.emailVerify({email:newEmail},data=>{
      if (data.status) {
        this._alert('success',data.message,'发送成功');
        let _user = this.state.userInfo;
        _user.email = newEmail;
        this.setState({
          isEmail:false,
          userInfo:_user,
        });
      }else {
        this._alert('error',data.message,'失败');
      }
    });
  }
  _alert (type,title,msg) {
    if (type=='error') {
      this.refs.alert.error(
        title ,
        msg, {
          timeOut: 5000,
          extendedTimeOut: 1000
        });
    } else {
      this.refs.alert.success(
        title ,
        msg, {
          timeOut: 3000,
          extendedTimeOut: 1000
        });
    }
  }
  onChangeNewUser =(e)=> {
    e.preventDefault();
    this.setState({
      username:e.target.value
    });
  }
  onChangeNewEmail =(e)=> {
    e.preventDefault();
    this.setState({
      newEmail:e.target.value
    });
  }
  onOpenPwd =(e)=> {
    e.preventDefault();
    this.setState({
      isPwd:!this.state.isPwd
    });
  }
  onChangePwd =(e)=> {
    this.setState({
      password:e.target.value
    });
  }
  onChangeNewPwd =(e)=> {
    this.setState({
      new_password:e.target.value
    });
  }
  onChangeRePwd =(e)=> {
    this.setState({
      new_password_repeat:e.target.value
    });
  }
  onUpdatePwd =(e)=> {
    e.preventDefault();
    this._updatePwd();
  }
  _reset =(e)=>{
    this.setState({
      password:null,
      new_password:null,
      new_password_repeat:null,
    });
  }
  _updatePwd(){
    let obj = {
      'ModifyPasswordForm[password]':this.state.password,
      'ModifyPasswordForm[new_password]':this.state.new_password,
      'ModifyPasswordForm[new_password_repeat]':this.state.new_password_repeat
    };
    new UserModal().updatePassword(obj,data=>{
      if (data.status) {
        alert('修改成功！');
        this.setState({
          password:null,
          new_password:null,
          new_password_repeat:null,
        });
      } else {
        alert(data.msg.error);
      }
    });
  }
  onKey=(e)=>{
    const ENTER_KEY = 13;
    if (e.keyCode === ENTER_KEY) {
      this._updatePwd();
    }
  }
  tabPwd =(e)=>{
    this.setState({
      isPwd:true,
      isUc:false
    });
  }
  tabUser =(e)=>{
    this.setState({
      isUc:true,
      isPwd:false
    });
  }
  render() {
    let {username} = this.state.userInfo;
    username =username.length>16?username.substring(0,16).concat('...'):username;
    return (
      <form className='forms-lg'>
        <ToastContainer ref="alert" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
        <div className="panel-left-nav">
          <ul className="left-nav-menu">
            <li className={this.state.isUc?'nav-active':''} onClick={this.tabUser}>个人资料<i className="arr-right"></i></li>
            <li className={this.state.isPwd?'nav-active':''} onClick={this.tabPwd}>密码修改<i className="arr-right"></i></li>
          </ul>
        </div>
        <If when={this.state.isUc}>
          <div style={{marginTop:20}}>
          <If when={!this.state.isUser}>
            <div className="form-line mb10 ">
              <ul className="text-row">
                <li>用户名:</li>
                <li title={this.state.userInfo.username}>{username}</li>
                <li><span onClick={this.updateUser} className="btn btn-none-border">修改</span></li>
              </ul>
            </div>
          </If>

          <If when={this.state.isUser}>
            <div className="form-line mb10  required " >
              <input type="text" className="form-input" placeholder="请输入新的用户名" onChange={this.onChangeNewUser} value={this.state.username } />
              <br/>
              <span onClick={this.sendUser} className="btn btn-none-border">确认</span>
              <span onClick={this.cancelUser} className="btn" style={{float:'right'}}>取消</span>
            </div>
          </If>
          <If when={!this.state.isEmail}>
            <div className="form-line mb10 ">
              <ul className="text-row">
                <li>登录邮箱:</li>
                <li>
                  {this.state.userInfo.email}&nbsp;
                  {
                    // <If when={this.state.userInfo.email_verified==0}>
                    //   <Tooltip placement="top" overlay={<span>未验证,未验证邮箱将无法使用‘忘记密码’功能</span>}>
                    //     <i className="fa fa-exclamation-triangle color-error" />
                    //   </Tooltip>
                    // </If>
                  }
                </li>
                {
                  // this.state.userInfo.email_verified==0?
                  //   <li><span onClick={this.updateEmail} className="btn btn-none-border">验证</span></li>:
                  //   <li><span  className="btn-green btn-disabled btn-none-border" >已验证</span></li>
                }
                <li></li>
              </ul>
            </div>
          </If>

          <If when={this.state.isEmail}>
            <div className="form-line mb10 required">
              <input type="email" className="form-input" placeholder="请输入需要认证的邮箱" onChange={this.onChangeNewEmail} value={this.state.newEmail} />
              <br/>
              <span onClick={this.sendEmail} className="btn btn-none-border">发送邮件</span>
              <span onClick={this.cancelEmail} className="btn" style={{float:'right'}}>取消</span>
            </div>
          </If>
          </div>
        </If>


        <If when={this.state.isPwd}>
          <from>
            <div className="form-line ml-100 required " style={{marginTop:30}}>
              <input type="password" className="form-input mb10" placeholder="请输入原密码"  onChange={this.onChangePwd} value={this.state.password}/>
              <br/>
              <input type="password" className="form-input mb10" placeholder="请输入新密码" onChange={this.onChangeNewPwd} value={this.state.new_password}/>
              <br/>
              <input type="password" className="form-input mb10" placeholder="请重复新密码" onChange={this.onChangeRePwd} onKeyDown={this.onKey}value={this.state.new_password_repeat}/>
              <br/>
              <div className="form-line">
                <span onClick={this.onUpdatePwd} className="btn btn-none-border">确认</span>
                <span onClick={this._reset} className="btn" style={{float:'right'}}>重置</span>
              </div>
            </div>
          </from>
        </If>

      </form>
    );
  }
}
