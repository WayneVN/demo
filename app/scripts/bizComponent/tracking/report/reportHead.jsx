/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－报告页面-head"
 */

const React = require('react');
const _ = require('_');
const UploadRecord = require('../upload/uploadRecord');//上传流水页面－进度条
const TrackingModel = require('../../../model/trackingModel');
const moment = require('moment');
const Tooltip = require('rc-tooltip');


const ReportHead = React.createClass({
  getInitialState() {
    return {
      record: {},
      _progress: 0,
      titleNum: 0,
      error: false
    };
  },

  componentDidMount() {
    this.getData();
  },

  getData() {
    TrackingModel.getRecordinfo(result => {
      if (result.status) {
        this.setState({
          record: result.record
        }, () => {
           this.parseData();
        });
      }
    });
  },

  parseData() {
    /* 最近的上传时间距当前时间的天数/为进度条比例
     * 最近上传时间距当前时间小于1天 状态显示为“您已更新流水*/
    /* (今天 - upload_last_day)/(今天 - record_first_day)*/
    let {
      state: {
        record: {
          record_last_day,
          record_first_day,
          upload_first_day,
          upload_last_day
        }
      }
    } = this;

    // 最近的上传时间距当前时间的天数
    let a = moment().diff(moment(upload_last_day),'day');
    // 流水交易起始日期距当前总天数
    let b = moment().diff(moment(record_first_day),'day');
    this.setState({
      _progress: 1-(a/b),
      titleNum: a,
      error: a/b<0 || a/b > 1
    });
  },

  render() {
    let {
      state: {
        record: {
          record_last_day,
          record_first_day,
          upload_first_day,
          upload_last_day
        },
        titleNum,
        _progress,
        error
      }
    } = this;

    return (
      <div className="container-report-head">
        <ul className="report-head-title">
          <li className="report-head-logo fll">
            <i className="iconfont icon-jiudou9"></i>
          </li>
          <li>
            <ul className="report-head-list fll">
              <li className="report-head-item-title">
                投资分析报告
              </li>
              <li>
                {moment(record_first_day).format('YYYY/MM/DD')}
                ---
                {moment().format('YYYY/MM/DD')}
              </li>
            </ul>
          </li>
        </ul>
        {/* <Tooltip placement="right" overlay={
            <div className="tal">
          *请尽量选择完整的交易流水
            <br/>
            交易诊断报告深度分析需1-2
            <br/>
            个工作日
            </div>
            } >
            <a
            className="btn btn-orange btn-report-update flr"
            href="#/account/diagnosed"
            target="_blank"
            style={{
            zIndex: 0
            }}
            >
            交易诊断
            </a>
            </Tooltip> */}

        <a
            className="btn btn-orange btn-report-update flr"
            href="#/account/upload"
            style={{
              zIndex: this.props.first?200:0
            }}
        >
          {this.props.first?'上传流水':'更新流水'}
        </a>


        <UploadRecord
            _progress = {_progress}
            titleNum = {titleNum}
            error= {error}
            uploadLastDay={moment(upload_last_day).format('YYYY/MM/DD')}
        />

      </div>
    )
  }
});

module.exports = ReportHead;
