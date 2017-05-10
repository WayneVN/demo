'use strict';
var React = require('react');
var Reflux = require('reflux');

var DialogStore = require('../stores/dialogStore');
var AlertActions = require('../actions/AlertActions');
var DialogAction = require('../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var EnrolmentDialog = require("../bizComponent/dialogThemeA/enrolmentDialog");
var StockTagDialog = require("../bizComponent/dialogThemeA/stockTagDialog");

var UserCenter = require('../bizComponent/dialogThemeB/userCenter');
var LoginForm = require('../bizComponent/dialogThemeB/loginForm');
var RegEmailForm = require('../bizComponent/dialogThemeB/regEmailForm');
var RegSuccess = require('../bizComponent/dialogThemeB/regSuccess');
var RegTelForm = require('../bizComponent/dialogThemeB/regTelForm');
var Card = require('../bizComponent/dialogThemeB/card');

var Enrol = require('../bizComponent/dialogThemeB/enrol');
var Transact = require('../bizComponent/dialogThemeB/transact');
var Unlock = require('../bizComponent/dialogThemeB/unlock');
//var Enrol = require('../bizComponent/dialogThemeB/enrol');

var NewCxy = require('../bizComponent/dialogThemeB/newCxy');

var EnrolBind = require('../bizComponent/dialogThemeB/enrolBind');
var Report = require('../bizComponent/dialogThemeB/report');
var WechatLogin = require('../bizComponent/dialogThemeB/wechatLogin');

var StockTeach1 = require("../bizComponent/dialogThemeC/stockTeach1");
var StockTeach2 = require("../bizComponent/dialogThemeC/stockTeach2");

var StockDialog = require('../bizComponent/stockDialog/main');

var Include = React.createClass({
  mixins: [],

  getInitialState: function() {
    this.unDialogscribe = DialogStore.listen(this.changeDialog)
    return ({
      dialog: Dialog.Close,
      propsData: {},
    })
  },

  componentWillUnmount() {
    this.unDialogscribe();
  },

  changeDialog(data) {
    this.setState({
      dialog: data[0],
      propsData: data[1] || {},
    })
  },

  render() {

    switch (this.state.dialog) {
      case Dialog.RegEmailForm:
        return <RegEmailForm  />
      case Dialog.Login:
        return <LoginForm  />
      case Dialog.RegTelForm:
        return <RegTelForm  />
      case Dialog.Success:
        return <RegSuccess  {...this.state.propsData} />
      case Dialog.UserCenter:
        return <UserCenter {...this.state.propsData}/>
      case Dialog.Activeation:
        return <Activation />
      case Dialog.WechatLogin:
        return <WechatLogin />
      case Dialog.Message:
        return <Message />
      case Dialog.Report:
        return <Report />
      case Dialog.Step1:
        return <Step1 />
      case Dialog.HowStep1:
        return <HowStep1  />
      case Dialog.HowStep2:
        return <HowStep2 {...this.state.propsData} />
      case Dialog.HowStep3:
        return <HowStep3 {...this.state.propsData} />
      case Dialog.FileProgress:
        return <FileProgress {...this.state.propsData} />
      case Dialog.UploadError:
        return <UploadError {...this.state.propsData}/>
      case Dialog.UploadBill:
        return <UploadBill  />
      case Dialog.VirtualDialog:
        return <VirtualDialog />
      case Dialog.EnrolmentDialog:
        return <EnrolmentDialog />
      case Dialog.StockTagDialog:
        return <StockTagDialog {...this.state.propsData}/>
      case Dialog.StockTeach1:
        return <StockTeach1 />
      case Dialog.StockTeach2:
        return <StockTeach2 />
      case Dialog.StockDialog:
        return <StockDialog {...this.state.propsData}/>
      case Dialog.Enrol:
        return <Enrol />
      case Dialog.EnrolBind:
        return <EnrolBind />
      case Dialog.Cxy8:
        return <NewCxy type="8" />
      case Dialog.Cxy9:
        return <NewCxy type="9" />
      case Dialog.Cxy10:
        return <NewCxy type="10" />
      case Dialog.Cxy7:
        return <NewCxy type="7" />
      case Dialog.Card:
        return <Card />
      case Dialog.Transact:
        return <Transact propsData={this.state.propsData} />
      case Dialog.Unlock:
        return <Unlock propsData={this.state.propsData} />
    }

    return <div></div>;
  },

});

module.exports = Include;
