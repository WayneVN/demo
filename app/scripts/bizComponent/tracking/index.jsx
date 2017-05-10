/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "记账－报告首页
 */

const React = require('react');
import Router, {
  RouteHandler,
  Link
} from 'react-router';
import ReactToastr, {ToastContainer} from "react-toastr";
const DiagnosedModel = require('../../model/diagnosedModel');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const numeral = require('numeral');
const If = require('../../component/if');
const logger = require('../../util/logger');
const TrackingModel = require('../../model/trackingModel');
const _ = require('lodash');

const Layout = React.createClass({
  getInitialState() {
    return {
      clazz1: '',
      clazz2: '',
      clazz3: '',
      isDiagnosed: false,
      isUpload: false // 是否有流水记录
    };
  },

  componentDidMount() {
    logger.log({
      target: 'page_account_layout'
    });
    this.getUploadsHistoryData(); // 是否有流水记录
    this.isDiagnosed(); // 是否有诊断记录 status==500
  },

  isDiagnosed() {
    DiagnosedModel.getEvents(result => {
      let {
        status,
        data
      } = result;

      if (data.length) {
        let item = _.find(data, ['status', 500]);
        if (item) {
          this.setState({
            isDiagnosed: true
          });
        }
      }
    });
  },

  getUploadsHistoryData() {
    TrackingModel.getUploadsHistory(result => {
      let {
        data = [],
        status = false
      } = result;

      if ( status ) {
        if ( data.length == 0 ) {
          this.setState({
            isUpload: false
          });
        }
        else {
          let count = 0;
          data.map(item => {
            if (item.upload_status == '1') {
              count++;
            }
          });
          if (count > 0) {
            this.setState({
              isUpload: true
            });
          }
        }
      }
    });
  },

  msg() {
    this.refs.alert.error(
      '先去上传交易流水吧,上传成功即可查看',
      '状态',
      {
        timeOut: 5000,
        extendedTimeOut: 1000
      }
    );
  },

  _hover(index, is) {
    this.state[`clazz${index}`] = is ? 'fadeInUp panel-body-mark-block' : 'fadeOutDown panel-body-mark-block'
    this.setState(this.state);
  },

  render() {
    let {
      state: {
        clazz1,
        clazz2,
        clazz3,
        isUpload,
        isDiagnosed
      }
    } = this;

    return (
      <div className="container-report-bg">
        <ToastContainer
            ref="alert"
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
        />
        <div className="layout-head-banner">
          <img alt="" src="images/layout-head-banner.png"/>
        </div>
        <div className="layout-card-warp">
          <div className="layout-card-panel">
            <div className="panel-head">
              <span className="iconfont icon-sc"></span>
              <p className="panel-card-title">上传流水</p>
            </div>
            <div className="panel-body"
                 onMouseEnter={(e) => {this._hover(1, true)}}
                 onMouseLeave={(e) => {this._hover(1, false)}}
            >
              <img src="images/sc.png" className="panel-body-img"/>
              <div className={`panel-body-mark animated ${clazz1}`}>
                <p>上传数据</p>
                <br/>
                上传完整的交易流水，便于
                <br/>
                进行精准的交易分析、交易
                <br/>
                诊断。
              </div>
            </div>
            <div className="panel-foot">
              <a className="panel-sling-btn"
                 href="#/account/upload"
                 target="blank"
              >
                立即上传
              </a>
            </div>
          </div>

          <div className="layout-card-panel">
            <div className="panel-head">
              <span className="iconfont icon-icon-test5" />
              <p className="panel-card-title">交易分析</p>
            </div>
            <div className="panel-body"
                 onMouseEnter={(e) => {this._hover(2, true)}}
                 onMouseLeave={(e) => {this._hover(2, false)}}
            >
              <img src="images/fx.png" className="panel-body-img"/>
              <div className={`panel-body-mark animated ${clazz2}`}>
                <p>大数据分析</p>
                <br/>
                根据你的交易流水多维度精
                <br/>
                准分析账户盈亏状况，实时
                <br/>
                监控账户每日盈亏变化。
              </div>
            </div>
            {
              isUpload?(
                <div className="panel-foot">
                  <a className="panel-sling-btn"
                     href="#/account/report"
                     target="_blank"
                  >
                    点击查看
                  </a>
                </div>
              ):(
                <div className="panel-foot">
                <div className="panel-btns-warp">
                  <a className="panel-sling-btn"
                     href="#/account/report"
                     target="_blank"
                  >
                    查看案例
                  </a>
                </div>
                <div className="panel-btns-border" />
                <div className="panel-btns-warp">
                  <a className="panel-sling-btn"
                     href="javascript:;"
                     onClick={(e) => {this.msg()}}
                  >
                    我的报告
                  </a>
                </div>
                </div>
              )
            }
          </div>

          <div className="layout-card-panel">
            <div className="panel-head">
              <span className="iconfont icon-icon-test7" />
              <p className="panel-card-title">交易诊断</p>
            </div>
            <div className="panel-body"
                 onMouseEnter={(e) => {this._hover(3, true)}}
                 onMouseLeave={(e) => {this._hover(3, false)}}
            >
              <img src="images/zd.png" className="panel-body-img"/>
              <div className={`panel-body-mark animated ${clazz3}`}>
                <p>大数据诊断</p>
                <br/>
                雪球大V根据你的交易流水诊
                <br/>
                断你的交易行为，并给出实
                <br/>
                质的操作建议。
              </div>
            </div>
            {
              isDiagnosed?(
                <div className="panel-foot">
                  <a className="panel-sling-btn"
                     href="#/account/diagnosed"
                     target="_blank"
                  >
                    点击查看
                  </a>
                </div>
              ):(
                <div className="panel-foot">
                <div className="panel-btns-warp">
                  <a className="panel-sling-btn"
                     href="#/account/diagnosed"
                     target="_blank"
                  >
                    查看案例
                  </a>
                </div>
                <div className="panel-btns-border" />
                <div className="panel-btns-warp">
                  <a className="panel-sling-btn"
                     href="#/account/diagnosed"
                     target="_blank"
                  >
                    进行诊断
                  </a>
                </div>
                </div>
              )
            }
          </div>

        </div>
        
      </div>
    )
  }
});

module.exports = Layout;
