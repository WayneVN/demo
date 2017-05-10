"use strict"
/*
  注册成功
 */
var React = require('react');
var Reflux = require('reflux');
var _ = require('_');
var DialogThemeB = require('../../component/dialogThemeB');
var DialogAction = require('../../action/dialogAction');
var Dialog = DialogAction.Dialog;

var RegSuccess = React.createClass({
  getInitialState: function() {
    return {
      time: 5
    };
  },
  componentDidMount:function(){
    setTimeout(()=>{
      DialogAction.close(Dialog.Success);
    },5000);
    let t = setInterval(()=> {
      let {state:{time}} = this;
      if (time > 1) {
        this.setState({
          time:time-1
        });
      }else {
        clearInterval(t);
      }
    }, 1000);
  },
  render:function(){
    return (
      <DialogThemeB clazz="login-dialog">
        <DialogThemeB.Body className="modal-body center">
          <form className='forms'>
            <div className="form-head">
              <p className="form-title">
                <span className="title">注册成功</span>
                <br />
                <span className="smail">SUCCESS</span>
              </p>
              <div className="form-hr"></div>
            </div>
            <div className="form-line">
              <i className="fa fa-check-circle-o"></i>
              <p className="form-success">恭喜您注册成功!</p>
              <p className={this.props.email?'form-info':'form-info hide'}>请前往您的邮箱激活帐号</p>
              <p className="form-info">{this.state.time}秒后将自动关闭该窗口</p>
            </div>
          </form>
        </DialogThemeB.Body>
      </DialogThemeB>
    );
  }
});

module.exports = RegSuccess;
