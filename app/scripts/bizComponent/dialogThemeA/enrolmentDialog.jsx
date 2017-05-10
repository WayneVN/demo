'use strict';
/**
 * 训练营首页报名Dialog
 * @type {*|exports|module.exports}
 */
var React = require('react');
var DialogThemeA = require("../../component/dialogThemeA");

var EnrolmentDialog = React.createClass({

  getInitialState() {
    return({
      title: '夏令营报名即将开始...',
    })
  },

  render() {
    let {title} = this.state;
    return(
      <DialogThemeA title={title}>
        <DialogThemeA.Body>
          <div className="center enrolment">
            <p className="input-step">报名倒计时: <span className="">2</span>天</p>
            <p className="input-step">欲知详细信息请扫二维码!</p>
            <p>
            <img src="./images/erweima.jpg" style={{width:120}}/>
              </p>
          </div>
        </DialogThemeA.Body>
      </DialogThemeA>
    )
  }
});

module.exports = EnrolmentDialog;
