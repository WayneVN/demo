/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－layout－顶级模块"
 */

const React = require('react');
const Reflux = require('reflux');
import Router, {RouteHandler, Link} from 'react-router';
import Loading from '../components/loading';
const LoginStore = require('../stores/LoginStore');
const TrackingModel = require('../model/trackingModel');

const LoginAction = require('../actions/LoginActions');
const logger = require('../util/logger');
var DialogAction = require('../actions/dialogAction');
var Dialog = DialogAction.Dialog;


const Tracking = React.createClass({
  mixins: [Reflux.listenTo(LoginStore,'onUserChange')],

  onUserChange(obj) {
    if (obj.user_id) {
      this.setState({
        isLogin: true,
      });
    }
  },

  getInitialState() {
    return {
      isLogin: false,
      isLoading: true,
      user_num: ''
    };
  },

  componentDidMount() {
    LoginAction.userInfo();
    TrackingModel.getTallyInfo(result => {
      if (result.status) {
        this.setState({
          user_num: result.data.user_num
        });
      }
    });
    setTimeout(()=> {
      this.setState({
        isLoading: false,
      });
    } ,1000);
  },


  renderGuide() {
    let {
      state: {
        user_num
      }
    } = this;

    return (
      <div className="guide-container">
        <div className="guide-banner">
          <div className="guide-banner-warp">
            <div className="guide-banner-warp-l">
              <p className="banner-title">九斗</p>
              <p className="banner-detail">
                做您的数据智囊,
              </p>
              <p className="banner-detail">
                全方位数据体验,精准数据分析。
              </p>
              <a className="btn btn-orange btn-report-update mr10"
                 href="javascript:;"
                 onClick={event => DialogAction.open(Dialog.WechatLogin)}
              >
                登录
              </a>
              <a className="btn btn-white btn-report-update"
                 href="javascript:;"
                 onClick={event => DialogAction.open(Dialog.RegEmailForm)}
              >
                注册
              </a>
            </div>
            <div className="guide-banner-warp-r">
              <span className="guide-reg-num">
                {user_num}
              </span>
            </div>
          </div>
        </div>

        <div className="item item-left">
          <div className="item-img">
            <img
                src="./images/1.png"
                style={{
                  marginTop: 37
                }}
            />
          </div>
          <p className="item-text-warp">
            <span className="item-text-title">高效</span>
            <span className="item-text-detail">
              直接导入券商流水,
            </span>
            <span className="item-text-detail">
              及时性记录账户每日盈亏,
            </span>
            <span className="item-text-detail">
              实时监控账户盈亏变化。
            </span>
          </p>
        </div>

        <div className="item-bg">
          <div className="item item-right">
            <div className="item-img">
              <img
                  src="./images/2.png"
                  style={{
                    marginTop: 37
                  }}
              />
            </div>
            <p className="item-text-warp">
              <span
                  className="item-text-title"
                  style={{
                    backgroundColor: '#f8a73d'
                  }}
              >
                直观
              </span>
              <span className="item-text-detail">
                从上传流水起,
              </span>
              <span className="item-text-detail">
                永久性保存账户数据,
              </span>
              <span className="item-text-detail">
                多维度历史资产盈亏分析体系,
              </span>
              <span className="item-text-detail">
                及时把握账户资产状况。
              </span>
            </p>
          </div>
        </div>



        <div className="item item-left">
          <div className="item-img">
            <img
                src="./images/3.png"
                style={{
                  marginTop: 37
                }}
            />
          </div>
          <p className="item-text-warp" style={{
            marginTop: 130
          }}>
            <span
                className="item-text-title"
                style={{
                  backgroundColor: '#43c7f8'
                }}
            >
              全面
            </span>
            <span className="item-text-detail">
              全方位的账户收益率计算,
            </span>
            <span className="item-text-detail">
              与同期大盘指数相比较,
            </span>
            <span className="item-text-detail">
              随时了解阶段性盈亏。
            </span>
          </p>
        </div>

        <div className="item-bg">
          <div className="item item-right">
            <div className="item-img">
              <img
                  src="./images/4.png"
                  style={{
                    marginTop: 37
                  }}
              />
            </div>
            <p className="item-text-warp">
              <span
                  className="item-text-title"
                  style={{
                    backgroundColor: '#f83d4f'
                  }}
              >
                详细
              </span>
              <span className="item-text-detail">
                详细周全的个股盈亏分析,
              </span>
              <span className="item-text-detail">
                多维度历史资产盈亏分析体系,
              </span>
              <span className="item-text-detail">
                盈亏金额全面掌握。
              </span>
            </p>
          </div>
        </div>

      </div>
    )
  },

  render() {
    let {
      state: {
        isLogin = false,
        isLoading
      }
    } = this;

    if (isLoading) {
      return (
        <Loading />
      );
    }

    return !isLogin ? this.renderGuide():
           (
             <RouteHandler/>
           );
  }
});

module.exports = Tracking;
