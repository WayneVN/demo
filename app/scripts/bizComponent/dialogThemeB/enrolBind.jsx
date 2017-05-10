"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: 训练营绑定邮箱
 */

var React = require('react');
var SummerModel = require('../../model/summerModel');
var format = require('../../util/format');
var UserInfo = require('../../util/userInfo');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeA = require('../../component/dialogThemeA');
const LoginActions = require('../../actions/LoginActions');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
const maps = {
  5: '您的邮箱已通过验证,可直接进入冬令营金融数据库版',
  6: '您的邮箱已通过验证,可直接进入冬令营九斗数据版',
}

var EnrolBind = React.createClass({

  getInitialState() {
      return({
        wechatSrc:'',
        isLoad:true,
        time: true,
        status: true,
        val: '',
        errMsg: <p className="fll enrol-text-err"> 未查询到您的报名信息,请填写正确邮箱;<br/>如您刚刚付费,请于次日验证邮箱。</p>,
        successMsg: '您的邮箱已通过验证,可直接进入冬令营金融数据库版',
        send: false,
        selectVal: 6
      });
  },

  componentDidMount(){
  },

  change(e) {
    this.setState({
      val: e.target.value
    });

  },

  sendEmail() {
    let obj = {
      uid: UserInfo.get().data.user_id,
      user_name: UserInfo.get().data.username,
      email: UserInfo.get().data.email,
      course_id: this.state.selectVal,
      order_id: this.state.val
    };

    SummerModel.userRegister(obj, result => {
      let {
        status,
        message
      } = result;
      if (status) {
        window.location.href = "/#/camps/6";
      }

      this.setState({
        status: status,
        send: true
      });

    });
  },

  inputChange(e) {
    this.setState({
      selectVal: e.target.value
    });
  },

  render() {
    let {
      state: {
        status,
        errMsg,
        successMsg,
        send
      }
    } = this;


    return (
      <DialogThemeA title={'已报名'} clazz="enrol-panel" >
        <div className="enrol-panel-body">
          <div className="enrol-row">
            <div className="enrol-zkm-panel" style={{
              background: 'white'
            }}>
              <p className="enrol-zkm-label">
                <span className="fll">请选择您报名的课程：</span>
                <select defaultVlaue="6"
                        className="enrol-zkm-input-lg"
                        onChange={(e)=>{
                            this.inputChange(e)
                          }}
                        value={this.state.selectVal}
                >
                  <option value="6">冬令营九斗数据版</option>
                  <option value="5">冬令营金融数据库版</option>
                </select>
              </p>

              <br />
              <p className="enrol-zkm-label">
                <span className="fll">请输入你付款时订单号：</span>
                <input className="enrol-zkm-input-lg"
                       type="text"
                       value={this.state.val}
                       onChange={this.change}
                />
              </p>

              <br/>
              {
                send? (status? (
                  <p className="fll enrol-text">{maps[this.state.selectVal]}</p>
                ): (
                 {errMsg}
                )): (
                  <noscript />
                )
              }
              <a className="enrol-zkm-btn flr" href="javascript:;"
                 onClick={this.sendEmail}
              >提交</a>
            </div>
          </div>

        </div>
      </DialogThemeA>
    );
  },


});

module.exports = EnrolBind;
