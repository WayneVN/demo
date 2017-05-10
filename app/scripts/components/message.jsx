"use strict"
/*
  老用户提示
 */

import React,{Component} from 'react';

export default class Message extends Component{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // setTimeout(()=>{
    //   this.props.close();
    // },3000);
  }
  switchPanel(){
    e.preventDefault();
    this.props.switchPanel()
  }
  render() {
    return (
      <form className='forms'>
        <div className="form-head">
          <p className="form-title">
            <span className="title">欢迎回来</span>
            <br />
            <span className="smail">WELCOME&nbsp;BACK</span>
          </p>
          <div className="form-hr"></div>
        </div>
        <div className="form-line">
          <p className="form-success" style={{textAlign:'left'}}>&nbsp;&nbsp;因产品系统升级，需统一对登录邮箱<br/>进行验证，请前往个人中心，验证您的产品。请您尽快完成验证流程，否则将对您使用网站
          功能产生影响。<br/><span style={{float:'right'}}>谢谢您对九斗的关注。</span></p>
        <button onClick={this.switchPanel} className="btn-full-org" >前往个人中心</button>
        </div>
      </form>
    );
  }
}
