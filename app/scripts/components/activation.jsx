"use strict"
/*
  激活成功
 */

import React,{Component} from 'react';

export default class Activation extends Component{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(()=>{
      this.props.close();
    },3000);
  }
  render() {
    return (
      <form className='forms'>
        <div className="form-head">
          <p className="form-title">
            <span className="title">激活成功</span>
            <br />
            <span className="smail">SUCCESS</span>
          </p>
          <div className="form-hr"></div>
        </div>
        <div className="form-line">
          <i className="fa fa-check-circle-o"></i>
          <p className="form-success">恭喜您激活成功!</p>
          <p className="form-info">3秒后将自动关闭该窗口并登录</p>
        </div>
      </form>
    );
  }
}
