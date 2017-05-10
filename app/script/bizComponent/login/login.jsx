'use strict';
var React = require('react');
var Reflux = require('reflux');

var DialogStore = require('../../store/dialogStore');
var DialogAction = require('../../action/dialogAction');
var Dialog = DialogAction.Dialog;

var LoginForm = require('./loginForm');
var RegEmailForm = require('./regEmailForm');
var RegSuccess = require('./regSuccess');
var RegTelForm = require('./regTelForm');
var WechatLogin = require('./wechatLogin');

var Login = React.createClass({

  getInitialState: function() {
    this.unDialogscribe = DialogStore.listen(this.changeDialog);

    return({
      dialog:Dialog.Close,
      propsData : {},
    })
  },

  componentWillUnmount(){
    this.unDialogscribe();
  },

  changeDialog(data) {
      this.setState({
        dialog: data[0],
        propsData : data[1] || {},
      })
  },

  getContent() {
      switch(this.state.dialog){
          case Dialog.RegEmailForm:
              return  <RegEmailForm />
          case Dialog.LoginForm:
              return  <LoginForm />
          case Dialog.RegTelForm:
              return  <RegTelForm />
          case Dialog.Success:
              return  <RegSuccess  {...this.state.propsData} />
          case Dialog.WechatLogin:
              return  <WechatLogin />
      }

  },

  render(){
    return (
      <div>
       {this.getContent()}
      </div>
    );
},


});

module.exports = Login;
