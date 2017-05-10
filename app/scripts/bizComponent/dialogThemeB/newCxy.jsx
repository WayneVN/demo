"use strict"
/**
 * @author: 陈民
 * @email: min.chen@joudou.com
 * @Desc: 2017春训营，各种版本
 */

var React = require('react');
var MergerModal = require('../../model/mergerModal').default;
var format = require('../../util/format');
var If = require('../../component/if');
var Loading = require('../../component/loading');
var DialogThemeA = require('../../component/dialogThemeA');
const Modal = new MergerModal();
const LoginActions = require('../../actions/LoginActions');
const UserInfo = require('../../util/userInfo');
var DialogAction = require('../../actions/dialogAction');
const CampModal = require('../../model/campModal');
var Dialog = DialogAction.Dialog;

const TEXTMAP = {
  8: {
    text: '9期课程, 9次线上互动 (每次1.5小时)',
    price: 2690,
    name: '2017春训营升级版',
    ercode: 'sjb.png',
    link: 'https://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503516236&idx=1&sn=0f21c42650dd23ee1d7d577207ddc1d5&chksm=04b0ea4233c7635447bfc14912ee77b9c32e7b94c769564a96ecf9f22758876d9cd714e8e9c1&mpshare=1&scene=1&srcid=02189vZ1qEHMLTMvnZSuBKUz&key=e0dbb28a61170240105a806a7183a1c4fda63274960d447822173bb25035ef422585f0bf19831331d3b3bd440c41be84b7a07314b25767386e4b3a057f1aaf1483f4367eed768b55bfa2ac104b81843b&ascene=0&uin=MzkwNDUwNDU%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.2+build(16C67)&version=12010310&nettype=WIFI&fontScale=100&pass_ticket=YzZYfkqDwFUdkdjizNN16B5GcBgruz7A0SWetW2Jjfc%3D'
  },
  7: {
    text: '9期课程, 3次语音答疑, 无线上互动',
    name: '2017春训营经典版',
    price: 1290,
    ercode: 'jdb.jpg',
    link: 'https://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503516177&idx=1&sn=e25b582a104ba00dcedddb09e21ea699&chksm=04b0ea1f33c76309bb6d6e9d3965f6617d756f7d0dde2aaa86454784eb3c49775f092e0269ff&mpshare=1&scene=1&srcid=0217ulDotQv7GaMV43QHsFiQ&key=783f605dc2ce27fa731e3f854e3fb095cf7a0ccabcc1693a4fc18cc10d29014f4f6832dd678ac99011cf4332a48e505b13ca23daa3717f5e1498a3f13a6f296ba8293cfaccc7d359132f10828c4181a6&ascene=0&uin=MzkwNDUwNDU%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.2+build(16C67)&version=12010310&nettype=WIFI&fontScale=100&pass_ticket=c0eXn8WMskTsCeMm4nU9T3i%2BZWs9dULZTy8KsybPM8w%3D'
  },
  9: {
    name: '2017春训营聚源版',
    text: '9期课程, 3次线上互动 (每次1.5小时), 一人独享聚源账号',
    price: 2990,
    ercode: 'jyb.png',
    link: 'https://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503516191&idx=1&sn=945ac686ff86bb846fb0eaffc77a8447&chksm=04b0ea1133c763070975038c059485fa4ae10759b0ef31cc5b5b0601221631e4ed1da15e9d36&scene=0&key=d4cc92c20e2147b08ab3c84eb032d9fa20802f6346a5a6632218a149c049c587057f185fb1478fbb84f08b496af519962e3c7c188c2255195121c9b638fef5afb95265504faaf1475cca80122e82832a&ascene=0&uin=MzkwNDUwNDU%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.2+build(16C67)&version=12010310&nettype=WIFI&fontScale=100&pass_ticket=M0angGyK51uuoXroFh1fEg7PAFrHtWnBcU%2FyzbZvoh8%3D'
  },
  10: {
    name: '2017春训营choice版',
    text: '9期课程, 3次语音答疑, 2人共享choice账号, 无线上互动 ',
    price: 1990,
    ercode: 'choiceb.png',
    link: 'https://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503516190&idx=1&sn=9418aec72046314228cfad345cc5673f&chksm=04b0ea1033c76306fd59acf03e5c662c5118cbf11ed47380663f3db93e99cdcbd4b00de049f7&scene=0&key=978b43ce2235a77370b158cd64f60aacaa442efeda8b4253a654d13a26b1cc4c13cc0c6110f607840db35172a2032a1d63b598b07976a3ad99e7e144ef4fc75d751f28e61494708620f2795a4c19ab9a&ascene=0&uin=MzkwNDUwNDU%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.2+build(16C67)&version=12010310&nettype=WIFI&fontScale=100&pass_ticket=M0angGyK51uuoXroFh1fEg7PAFrHtWnBcU%2FyzbZvoh8%3D'
  }
}

var newCxy = React.createClass({

  getInitialState() {
    return({
      order_id: null
    });
  },

  componentDidMount(){
  },

  complete() {
    const {
      data: {
        user_id,
        email,
        username
      }
    } = UserInfo.get();
    let obj = {
      uid: user_id || null,
      email: email || null,
      user_name: username || null,
      order_id: this.state.order_id || null
    }
    CampModal.userRegisterByOrder(obj, r => {
      if (r.status) {
        setTimeout(() => {
          /* DialogAction.close(Dialog[`Cxy${id}`]);*/
          window.location.reload();
        }, 3000);
        alert('验证成功');
      }
      else {
        alert(r.message);
      }
    });
  },

  orderIdChange(e) {
    let {
      target: {
        value
      }
    } = e;
    this.setState({
      order_id: value
    });
  },

  render() {
    const {
      props: {
        type
      }
    } = this;

    return (
      <DialogThemeA title={TEXTMAP[type].name} clazz="enrol-panel" >
        <div className="enrol-panel-body">
          <div className="enrol-row">
            <p className="enrol-switch-label">
              课程简介:&nbsp;&nbsp;
              {TEXTMAP[type].text}
              <br/>
              点击查看
              <a href={TEXTMAP[type].link} target="blank" className="enrol-zkm-link">课程大纲</a>
            </p>
          </div>

          <div className="enrol-row">
            <p className="enrol-switch-label">
              课程价格&nbsp;:&nbsp;
              <span className="enrol-zkm-price">&nbsp;&yen;&nbsp;{TEXTMAP[type].price}</span>
            </p>
          </div>

          <div className="enrol-row">
            <div className="enrol-zfb"
                 style={{
                   width: 159
                 }}
            >
              <img  src={`../../../images/${TEXTMAP[type].ercode}`}/>
              <p>报名请用微信或支付宝扫描二维码直接购买</p>
            </div>
          </div>

          <div className="enrol-row mt20">
              <p className="enrol-input-label">
                已购买:&nbsp;&nbsp;
              </p>
              <input
                  className="enrol-input-text"
                  type="text"
                  value={this.state.order_id}
                  onChange={(e) => {this.orderIdChange(e)}}
                  placeholder="请输入您的订单号"
              />
              <span className="enrol-input-helper">
                <a href="http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503515826&idx=1&sn=ecb6744ff9cc2c795f659df43a38ffde&chksm=04b0ecbc33c765aa3bd6a8d1101a8ed67ee4458c341078e29d4c40293c6a4d48d1a8ac488532&scene=0#rd"
                   target="blank"
                >如何查找订单号？</a>
              </span>
          </div>
          <div className="enrol-row">
            <a className="btn btn-orange"
               href="javascript:;"
               onClick={() => {this.complete()}}
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

module.exports = newCxy;
