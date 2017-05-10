"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: 训练营报名
 */

var React = require('react');
var MergerModal = require('../../model/mergerModal').default;
var format = require('../../util/format');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeA = require('../../component/dialogThemeA');
const Modal = new MergerModal();
const LoginActions = require('../../actions/LoginActions');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var Enrol = React.createClass({

  getInitialState() {
      return({
        wechatSrc:'',
        isLoad:true,
        time: true,
      });
  },

  componentDidMount(){
    /* DialogAction.open(Dialog.EnrolBind);*/
  },

  render() {
    return (
      <DialogThemeA title={'报名中心'} clazz="enrol-panel" >
        <div className="enrol-panel-body">
          <div className="enrol-row">
            <div className="enrol-zkm-panel">
              <p className="enrol-label" style={{
                lineHeight: '70px'
              }}>
                2016年冬令营九斗数据版本
              </p>
              <span className="enrol-zkm-price">&nbsp;&yen;&nbsp;1290.00</span>
            </div>
          </div>

          <div className="enrol-row">
            <p className="enrol-switch-label">
              支付方式&nbsp;:&nbsp;
              <img alt="" src="../../../images/wx.png" style={{
                marginRight: 3
              }}/>
              微信/
              <img alt="" src="../../../images/zf.png" style={{
                marginRight: 3
              }}/>
              支付宝扫码均可支付
            </p>
          </div>

          <div className="enrol-row">
            <div className="enrol-zfb">
              <img alt="" src="../../../images/zhifubao.jpg"/>
              <p>扫一扫二维码立即付款</p>
            </div>
          </div>
        </div>
      </DialogThemeA>
    );
  },


});

module.exports = Enrol;
