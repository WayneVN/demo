/**
 * @file 记账报告-设置弹窗
 * @author min.chen@joudou.com
 */

var React = require('react');
const {Modal} = require('react-bootstrap');
var _ = require('lodash');
var $ = require('jquery');
var config = require('../report/config');

var SettingModal = React.createClass({

  getDefaultProps: function () {
    return {
      data: {}
    }
  },

  hide: function () {
    this.props.hide();
  },

  ok: function () {
    var me = this;
    var element = me.refs.container.getDOMNode();

    me.props.onOk({
      calculateType: $(element).find('input[name="cal-type"]:checked').val(),
      rankType: $(element).find('input[name="rank-type"]:checked').val()
    });
    me.hide();
  },

  openFeedback: function () {
    HeadAction.openUserCenter(PageEnum.userAccount.feedback);
  },

  renderHead: function () {
    return (
      <div className="modal-head">
        <img alt="logo" src="./images/JOUDOU.COM.png" className="m-head-logo"/>
        <h2>偏好设置</h2>
        <i className="fa fa-remove"
           onClick={() => {this.props.hide()}}/>
      </div>
    )
  },

  renderBody: function () {
    var setting = this.props.setting || {};

    return (
      <div className="setting-modal-body" ref="container">
        <div className="report-setting-row">
          <span className="name">收益计算方式:</span>
          <br/>
          {this.getRadio(config.radio.calType, setting.cal_type)}
        </div>
        <div className="report-setting-row">
          <span className="name">个股排名方式:</span>
          <br/>
          {this.getRadio(config.radio.rankType, setting.rank_type)}
        </div>
      </div>
    )
  },

  getRadio: function (param, value) {
    var arr = [];
    value = +value || 0;
    
    _.forEach(param, function (item) {
      if (item.value == value) {
        arr.push(
          <label>
            <input type="radio" name={item.name} 
                   defaultChecked value={item.value}/>
            <span className="radio-span">
              <span className="inner"></span>
            </span>
            {item.text}
          </label>
        )
      }
      else {
        arr.push(
          <label>
            <input type="radio" name={item.name} value={item.value}/>
            <span className="radio-span">
              <span className="inner"></span>
            </span>
            {item.text}
          </label>
        )
      }
    });

    return arr;
  },

  renderFoot: function () {
    return (
      <div className="modal-foot">
        <span className="jd-btn jd-btn-orange" onClick={this.hide}>取消</span>
        <span className="jd-btn jd-btn-orange" onClick={this.ok}>确定</span>
      </div>
    );
  },
  
  render: function () {
    return (
      <div
          className="setting-warp"
          onMouseLeave={this.hide}
      >
        <img src="../images/triangle-right.png" className="triangle-right"/>
        {this.renderBody()}
        {this.renderFoot()}
      </div>
    );
  }
});

module.exports = SettingModal;
