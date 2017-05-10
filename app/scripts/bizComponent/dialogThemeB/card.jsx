"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: 大v 卡片介绍
 */

var React = require('react');
const DiagnosedModel = require('../../model/diagnosedModel');
var format = require('../../util/format');
var UserInfo = require('../../util/userInfo');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeA = require('../../component/dialogThemeA');
const LoginActions = require('../../actions/LoginActions');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var Card = React.createClass({

  getInitialState() {
    return({
      isshow: false,
      initClazz: true,
      yz_order: '',
      msg: '',
      step: 1
    });
  },

  openFrom() {
    this.setState({
      isshow: !this.state.isshow,
      initClazz: true
    });
  },

  onchange(e) {
    this.setState({
      yz_order: e.target.value
    });
  },

  submitFrom() {
    let obj = {
      yz_order: this.state.yz_order,
      doctor_id: 1
    };
    const msgMap = {
      2: '订单号验证失败，请重新验证',
      3: '请在您的上一份报告诊断完成后，再进行验证',
      4: '此订单号已验证成功，请勿重复验证',
      1: '订单号验证成功，诊断报告需2-3个工作日，请耐心等待',
      5: '暂无交易流水可诊断，请去上传。'
    };
    const other = '未知错误!';
    DiagnosedModel.postRequest(obj, result => {
      this.setState({
        msg: msgMap[result.event_status] || other
      }, () => {
        if (result.event_status ==1 ) {
          setTimeout(() => {
            DialogAction.close(Dialog.Card);
          }, 5 * 1000);
        }
      });
    });
  },

  next() {
    this.setState({
      step: 2
    });
  },

  prev() {
    this.setState({
      step: 1
    });
  },

  step2() {
    return (
      <div>
        <div className="dd-row">
          <label>订单号:</label>
          <input type="text"
                 onChange={
                   this.onchange
                          }
          />
        </div>
        <p className="card-error-msg">
          {this.state.msg}
        </p>
        <a
            className="btn btn-orange btn-report-update fll"
            href="javascript:;"
            onClick={this.submitFrom}
            style={{
              marginLeft: 164
            }}
        >
          确认提交
        </a>
        <br/>
        <a
            href="javascript:;"
            onClick={this.prev}
            className="prev-link"
        >
          返回上一步
        </a>
      </div>
    );
  },

  step1() {
    return (
      <div>
        <img
            src="http://onb7pfrdl.bkt.clouddn.com/239fukuanma.jpeg"
            style={{
              width: 165,
              display: 'block',
              margin: '0 auto'
            }}
        />
        <a
            className="btn btn-orange btn-report-update fll"
            href="javascript:;"
            onClick={this.next}
            style={{
              marginLeft: 171
            }}
        >
          下一步
        </a>
      </div>
    );
  },

  render() {
    let {
      state: {
        isshow,
        initClazz,
        msg,
        step
      }
    } = this;
    let clazz = `animated ${ isshow? 'dd-panel fadeIn': 'dd-panel-hide fadeOut' }`;



    return (
      <DialogThemeA title={''} clazz="card-panel" >
        <div className="card-body">
          <img className="card-img" src="../../../images/qxk.png"/>
          <p className="card-title">
            骑行夜幕的统计客
          </p>
          <div className="card-detail">
            <p className="card-detail-label">
              学术背景：
            </p>
            <p className="card-detail-text">
              哈佛商学院MBA；上海交通大学学士；
              <br/>
              波士顿咨询，IDG资本，中银投资；
              <br/>
              横贯风险投资(VC)杠杆收购(LBO)A股港股美股市场。
            </p>
          </div>
          <div className="card-detail">
            <p className="card-detail-label">
              诊断价格:
            </p>
            <p className="card-detail-text card-detail-red">
              ¥239&nbsp;&nbsp;
              <span style={{
                color: '#848484',
                fontSize: 14,
                lineHeight: '30px',
              }}>原价:</span>
              <span style={{
                color: '#848484',
                fontSize: 14,
                lineHeight: '30px',
                textDecoration: 'line-through'
              }}>¥299</span>
            </p>
          </div>
          <div className="card-info">
            注:本次交易诊断是针对您当前所上传的所有交易流水作出的诊断,请您确保交易流水完整。
          </div>
          <a
              className="btn btn-orange btn-report-update card-btn"
              href="javascript:;"
              onClick={
                this.openFrom
                      }
          >
            立即支付
          </a>
          <div className="card-info-sm">
            *微信/支付宝扫码均可付款
          </div>
          <div className={clazz} >
            {this[`step${ step }`]()}
          </div>
        </div>
      </DialogThemeA>
    );
  },


});

module.exports = Card;
