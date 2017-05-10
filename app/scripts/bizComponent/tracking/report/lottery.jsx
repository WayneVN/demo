/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "记账－抽奖模块"
 */

const React = require('react');
const _ = require('_');
const moment = require('moment');
const numeral = require('numeral');
const If = require('../../../component/if');
const LotteryModal = require('../../../model/lotteryModal');
const logger = require('../../../util/logger');
const KEYMAPS = [
  {
    prize_name: "iPhone",
    deg: 60*6-30,
  },
  {
    prize_name: "训练营免费1期",
    deg: 60*1-30,
  },
  {
    prize_name: "线上产品3年VIP(不含训练营)",
    deg: 60*2-30,
  },
  {
    prize_name: "200斗米",
    deg: 60*3-30,
  },
  {
    prize_name: "2500斗米",
    deg: 60*5-30,
  },
  {
    prize_name: "所有产品5折券",
    deg: 60*4-30,
  }
];



const Lottery = React.createClass({
  getInitialState() {
    return {
      show: false,
      numbershow: false,
      resultList: [],
      count: 5 * 360, //旋转次数
      angle: 0,
      isPlay: true,
      z: 100,
      isResult: false,
      prize_name: '',
      remaining: 0,
      _remaining: 0,
      rank: '--',
      today_upload_data_status: false,
      _today_upload_data_status: false,
      win: false
    }
  },

  openDzp(e) {
    logger.log({
      target: 'lottery_click_open'
    });
    this.setState({
      show: !this.state.show,
    });
  },

  closePhb() {
    this.setState({
      numbershow: false
    });
  },

  openPhb(e) {
    logger.log({
      target: 'lottery_click_number'
    });
    LotteryModal.eratio(result => {
      let {
        status,
        data,
        rank
      } = result;
      if (status) {
        this.setState({
          numbershow: !this.state.numbershow,
          resultList: data,
          rank: rank || '--'
        });
      }
    });
  },

  // 获取当日抽奖次数
  getCount(cb) {
    LotteryModal.count(result => {
      this.setState({
        _remaining: result.data.remaining,
        _today_upload_data_status: result.data.today_upload_data_status
      }, () => {
        return cb();
      });
    });
  },

  play() {
    let {
      state: {
        count,
        angle,
        isPlay
      }
    } = this;
    logger.log({
      target: 'lottery_play'
    });

    if (!isPlay) {
      return ;
    }
    let cou = 0;
    this.getCount(() => {
      if (
        this.state._remaining == 0
      ) {
        this.setState({isResult: true});
      }
      else {
        LotteryModal.draw(result => {
          this.setState({
            prize_name: result.data.prize_name,
            remaining: result.data.remaining,
            win: result.data.win,
            today_upload_data_status: result.data.today_upload_data_status
          });
          let sum = count + _.find(KEYMAPS, {'prize_name': result.data.prize_name}).deg;
          let time = setInterval(()=> {
            if (cou<=sum) {
              if (cou < count) {
                cou+=5;
              }
              else {
                cou++;
              }
              this.setState({
                angle: cou,
                isPlay: !(cou<=sum),
              });
            }
            else {
              clearInterval(time);
              setTimeout(()=> {
                this.setState({
                  isResult: true,
                  z: 103
                });
              }, 200)
            }
          },1)
        });
      }

    });

  },

  // 渲染小转盘按钮
  renderXzp() {
    return (
      <div>
        <img alt="抽奖"
             src="../images/xzp.png"
             className="lty-xzp animated zoomInDown"
             onClick={this.openDzp}
        />
        <a href="javascript:;"
           className="lty-xzp"
           onClick={this.openPhb}
           style={{
             width: 120,
             top: 550,
             marginLeft: 540
           }}
        >查看收益率排行</a>
      </div>
    );
  },

  // 渲染抽奖大转盘
  renderDzp() {
    return (
      <div className="guidemark-warp">
        <div className="modal-backdrop fade in"
             style={{
               zIndex: this.state.z
             }}
        >
        </div>
        <div className="lty-dzp animated slideInDown">
          <span
              className="close-btn"
              onClick={this.openDzp}
          >
            <img src="../images/close_btn.png"/>
          </span>
          <img src="../images/dzpbj.png" className="lty-dzp-img"/>
          <a href="javascript:;"
             className="dzp_btn"
             onClick={() => {this.play()}}
          >
            &nbsp;
          </a>
          <span className="lty-zz"
                style={{
                  transform: `rotate(${this.state.angle}deg)`
                }}>
            <img src="../images/dzp_zz.png" />
          </span>
        </div>
        {this.renderResult()}
      </div>
    );
  },

  //关闭结果展示框
  closeResult() {
    this.setState({
      isResult: false,
      z: 100
    });
  },

  renderPhb() {
    let {
      state: {
        resultList,
        rank
      }
    } = this;

    return (
      <div className="guidemark-warp">
        <div className="modal-backdrop fade in"
             style={{
               zIndex: this.state.z
             }}
        >
        </div>
        <div className="lty-result animated slideInDown">
          <span
              className="close-btn"
              onClick={this.closePhb}
          >
            <img src="../images/close_btn.png"/>
          </span>
          <div className="lty-result-panel">
            <p className="lty-result-panel-head">
              您好,您当前的排名为: <span className="lty-result-panel-head-num">{rank}</span>
            </p>
            <img src="../images/TOP30.png" className="lty-result-panel-title"/>
            <ul className="lty-list-fixed">
              <li className="lty-list-head">
                <span className="lty-item-l">排名</span>
                <span className="lty-item-c">用户名</span>
                <span className="lty-item-r">收益率</span>
              </li>
            </ul>
            <div className="lty-result-panel-body">

              <ul className="lty-list">
                {
                  resultList.map((item, k) => {
                    return (
                      <li className="lty-list-head" key={k}>
                        <span className={
                          `lty-item-l ${k+1<=3?'lty-r': '' }`
                                        }>
                          {k<9?`0${k+1}`:k+1}
                        </span>
                        <span className="lty-item-c text-overflow">{item.username}</span>
                        <span className="lty-item-r">{numeral(item.ratio).format('0.00%')}</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderOver() {
    return (
      <div className="lty-result-panel">
        <a
            className="lty-result-close"
            href="javascript:;"
            onClick={() => {this.closeResult()}}
        >
          <img src="../images/close_btn.png"/>
        </a>

        <p className="lty-result-name" style={{
          marginTop: 80
        }}>
          每人每天只有一次哦～
          <br/>
          别太担心，明天再来吧!
        </p>

        <p className="lty-result-msg" style={{
          marginTop: 100
        }}>
          *前往个人帐户查看中奖记录
        </p>
      </div>
    );
  },

  // 抽奖结果展示
  renderResult() {
    let {
      state: {
        prize_name = '',
        remaining = 0,
        isResult,
        today_upload_data_status,
        _today_upload_data_status,
        _remaining,
        win
      }
    } = this;

    if (!isResult) {
      return (
        <noscript />
      );
    }
    if (_remaining==0) {
      return this.renderOver();
    }

    return (
      <div className="lty-result-panel">
        <a
            className="lty-result-close"
            href="javascript:;"
            onClick={() => {this.closeResult()}}
        >
          <img src="../images/close_btn.png"/>
        </a>

        <div>
          <p className="lty-result-name" style={{marginTop: 50}}>
      恭喜您获得
          </p>
          <p className="lty-result-name lty-result-text-red">
            {prize_name}
          </p>
        </div>
        <p className="lty-result-msg" style={{marginTop:140}}>
          *前往个人帐户查看中奖记录
        </p>
      </div>
    );
  },

  render() {
    let {
      state: {
        show,
        numbershow
      }
    } = this;

    return (
      <div>
        {this.renderXzp()}
        {show?this.renderDzp():<noscript />}
        {numbershow?this.renderPhb(): <noscript />}
      </div>
    );
  }
});

module.exports = Lottery;
