"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: 开通训练营vip
 */

var React = require('react');
var MergerModal = require('../../model/mergerModal').default;
var format = require('../../util/format');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeA = require('../../component/dialogThemeA');
const Modal = new MergerModal();
const LoginActions = require('../../actions/LoginActions');
const SpringModel = require('../../model/summerModel');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

var Transact = React.createClass({

  getInitialState() {
      return({
        order_id: ''
      });
  },

  updateVal(e) {
    let {
      target: {
        value
      }
    } = e ;
    this.setState({
      order_id: value
    });
  },

  complete() {
    if (!this.state.order_id) {
      this.alertMsg('error', '请检查', '订单号输入有误!');
      return ;
    }

    let obj = {
      uid: this.props.propsData.uid,
      course_id: this.props.propsData.course_id,
      order_id: this.state.order_id
    };
    SpringModel.upgrade(obj, result => {
      let {
        status,
        data,
        message
      } = result;
      if (status) {
        this.alertMsg('success', '', '支付成功!');
        setTimeout(()=>{
          window.location.reload();
        }, 3000);
      }
      else {
        this.alertMsg('error', '', message);
      }
    });
  },

  alertMsg(type, title, msg) {
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  render() {
    return (
      <DialogThemeA title={'开通土豪版'} clazz="enrol-panel" >
        <ToastContainer
           ref="alert"
           toastMessageFactory={ToastMessageFactory}
           className="toast-top-right"
           />
        <div className="enrol-panel-body">

          <div className="enrol-row">
            <p className="enrol-switch-label" style={{marginBottom: 5}}>
              简介:&nbsp;&nbsp;每人有三次不交作业豁免机会，三次豁免用完后，每次不交
            </p>
            <p className="enrol-switch-label" style={{marginBottom: 5, paddingLeft: 40}}>
              作业查看答案秘籍须支付100元，土豪版所有秘籍免费查看。
            </p>
          </div>

          <div className="enrol-row">
            <p className="enrol-switch-label" style={{marginBottom: 5}}>
              VIP&nbsp;价格:
              <span className="enrol-zkm-price">&nbsp;&yen;&nbsp;600</span>
            </p>
          </div>
          <div className="enrol-row">
            <div className="enrol-zfb"
                 style={{
                   width: 159
                 }}
            >
              <img  src={`http://onb7pfrdl.bkt.clouddn.com/vip.jpg`}/>
            </div>
          </div>

          <div className="enrol-row mt20">
              <p className="enrol-input-label">
                已支付:&nbsp;&nbsp;
              </p>
              <input
                  className="enrol-input-text"
                  type="text"
                  placeholder="请输入您的订单号"
                  onChange={e => {this.updateVal(e)}}
              />
              <a className="enrol-input-helper"
                 target="_blank"
                 href="http://url.cn/464DUWI">
                如何查找订单号？
              </a>
          </div>
          <div className="enrol-row">
            <a className="btn btn-orange"
               href="javascript:;"
               onClick={e=>{this.complete()}}
            >
              &nbsp;&nbsp;完&nbsp;成&nbsp;&nbsp;
            </a>
          </div>

          <div className="enrol-row">
              <p style={{color: '#999'}}>*若您的订单号验证成功,3s后为您关闭此页面</p>
          </div>
        </div>
      </DialogThemeA>
    );
  },


});

module.exports = Transact;
