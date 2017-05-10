/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－上传流水页面－进度条"
 */

const React = require('react');
const Reflux = require('reflux');
import Router, {RouteHandler, Link} from 'react-router';


const UploadRecord = React.createClass({
  renderTitle() {
    const {
      props: {
        _progress,
        titleNum,
        error = false
      }
    } = this;

    if (error) {
      return (
        <span className="tracking-user-update-info-detail">您的交易日期有误</span>
      );
    }
    if (titleNum < 1) {
      return (
        <span className="tracking-user-update-info-detail">您已更新流水</span>
      );
    }
    else {
      return (
        <span className="tracking-user-update-info-detail">您已经<span className="tacking-num">{titleNum}</span>天未更新流水</span>
      );
    }
  },

  renderTime() {
    const {
      props: {
        _progress,
        titleNum,
        uploadLastDay
      }
    } = this;
    return (
      <div style={{width: `${ _progress*100 }%`}}>
        <span className="tracking-time-right">{uploadLastDay}</span>
      </div>
    );
  },

  render() {
    const {
      props: {
        _progress,
        titleNum
      }
    } = this;

    return (
      <div className="tracking-user-update-info flr">
        {this.renderTitle()}
        <div className="day-progress-container">
          <div className="day-progress">
            <div className="day-bar" style={{width: `${ _progress*100 }%`}}>
              <span className="iconfont icon-logosm" />
            </div>
          </div>
        </div>
        {this.renderTime()}
      </div>
    );
  }
});

module.exports = UploadRecord;
