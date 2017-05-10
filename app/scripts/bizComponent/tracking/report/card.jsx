/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: 弹出窗口- 恭喜您xxxx
 */

const React = require('react');

const Card = React.createClass({
  getInitialState() {
    return {
      show: true
    }
  },

  close() {
    this.setState({
      show: false
    })
  },

  render() {
    if (!this.state.show){
      return (
        <noscript />
      );
    }
    return (
      <div className="card-warp">
        <div className="card-mark"></div>
        <img src="images/kuang.png" className="cards-img"/>
        <img src="images/kuang-close.png"
             className="card-img-close"
             onClick={e=>{this.close()}}
        />
        <div className="card-panels">
          <h1>恭喜您</h1>
          <p>获得交易诊断<span className="card-high">限时8折</span>优惠</p>
          <p>前100名用户还将获得<span className="card-high">万1.5</span></p>
          <p>开户资格哦</p>
          <p className="card-info-link">
            查看详情:&nbsp;
            <a href="http://t.cn/Risn5Vg" target="_blank">http://t.cn/Risn5Vg</a>
          </p>
          <a href="#/account/diagnosed">
            <img src="images/buttom.png" className="card-btn-img"/>
          </a>
        </div>
      </div>

    )
  }
});

module.exports = Card;
