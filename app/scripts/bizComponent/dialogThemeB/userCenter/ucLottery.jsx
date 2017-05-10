/**
 * @file 个人中心-我的奖券
 * @author min.chen@joudou.com
 */
var React = require('react');
var pageEnum = require('../../../util/pageEnum');
var model = require('../../../model/doumiModel');
var VS = require('../../../bizComponent/doumi/vs');
var Time = require('../../../bizComponent/doumi/time');
var _ = require('lodash');
var If = require('../../../component/if');
var moment = require('moment');
var DoumiAction = require('../../../actions/doumiAction');
const LotteryModal = require('../../../model/lotteryModal');
import Tooltip from 'rc-tooltip';

const KEYMAPS = [
  {
    prize_name: "新产品免费半年",
    uri: 'jx2.png',
    yz_code: 'jx2.png',
  },
  {
    prize_name: "训练营8折",
    uri: 'jx3.png',
    yz_code: 'jx33.png',
  },
  {
    prize_name: "训练营5折",
    uri: 'jx1.png',
    yz_code: 'jx11.png',
  },
  {
    prize_name: "线上产品3年VIP(不含训练营)",
    uri: 'cp1.png',
    yz_code: 'jx11.png',
  },
  {
    prize_name: "训练营免费1期",
    uri: 'cp2.png',
    yz_code: 'cp2.png',
  },
  {
    prize_name: "所有产品5折券",
    uri: 'cp3.png',
    yz_code: 'jx33.png',
  },
  {
    prize_name: "300元优惠券",
    uri: "300-1.png",
    yz_code: '300.png'
  },
  {
    prize_name: "100元优惠券",
    uri: "100-1.png",
    yz_code: '100.png'
  },
  {
    prize_name: "50元优惠券",
    uri: "50-1.png",
    yz_code: '50.png'
  }
];

const UcLottery = React.createClass({

  getInitialState() {
    return {
      prize: [],
      active: 100
    }
  },

  componentDidMount() {
    this.getData();
  },

  getData() {
    LotteryModal.myprizes(result => {
      this.setState({prize: result.data});
    });
  },

  transfer(params) {
    this.props.transfer({
      page: pageEnum.userAccount[params]
    });
  },

  render() {
    return (
      <div className="uc-panel-body">
                <div className="uc-left-menu">
                    <ul className="uc-nav">
                        <li onClick={() => {this.transfer('integral')}}>我的积分</li>
                        <li onClick={() => {this.transfer('doumi')}}>我的竞猜</li>
                        <li className="uc-left-active">我的奖品</li>
                        <li onClick= {() => this.transfer('setting')}>喜好设置</li>
                    </ul>
                </div>

                <div className="uc-right-content">
                    {this.renderDoumi()}
                </div>
            </div>
    );
  },

  isActive(k) {
    this.setState({
      active: k
    });
  },

  renderDoumi() {
    let {
      state: {
        prize,
        active
      }
    } = this;
    return (
      <div className="user-center-doumi">
        {
          prize.map((item, k) => {
            let it =  _.find(KEYMAPS, {"prize_name": item.prize_name});
            return (
              <div className="jq-warp" key={k}>
                <img
                    className="jq-img"
                    src={`../images/${active == k?it.yz_code:it.uri }`}
                    onClick={() => {
                        this.isActive(k);
                      }}
                />
                {item.used ==0 ? <noscript /> : <img className="jq-used" src="../images/used.png" />}
                <p className="jq-code">
                  {
                    (
                      item.prize_id==4 ||
                      item.prize_id==5 ||
                      item.prize_id==11 ||
                      item.prize_id==12 ||
                      item.prize_id==13
                    ) ?
                    (active == k?(item.yz_code|| '敬请期待'):'' ):
                    ( <noscript /> )
                  }
                </p>
              </div>
            )
          })
        }
        <p className="rules-title">
          <a href="http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503516235&idx=1&sn=bba858c726d6856cda19952525e42838&chksm=04b0ea4533c76353d62246044b87e413a2caefec936ae8fb63c60d3d1485e20202471a5946a3&scene=0#rd" target="blank">
            *使用说明*
          </a>
        </p>
        <p className="rules-detail">产品券只可在交易追踪和消息神器下使用;</p>
        <p className="rules-detail">*交易追踪和消息神器暂未开启收费，奖券在收费后才可使用</p>

      </div>
    )
  }
});

module.exports = UcLottery;
