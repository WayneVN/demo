'use strict';
/**
 * 训练营首页
 * @type {*|exports|module.exports}
 */
var React = require('react');
const Reflux = require('reflux');
var CampModal = require('../model/campModel');
var SummerModel = require('../model/summerModel');
const _ = require('lodash');
import MergerModal from '../model/userModel';
const Model = new MergerModal();
var DialogAction = require('../action/dialogAction');
var Dialog = DialogAction.Dialog;
const LoginStore = require('../store/loginStore');
var UserInfo = require('../util/userInfo');
var logger = require('../util/logger');
const url = 'http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=2650999351&idx=1&sn=9c2c2bc043c82da648c8698e99f243ee&chksm=84b0ec39b3c7652fefc7a3f405d543672ed4586bd196601cb585df809d0a0b1c821f28e1adcb&mpshare=1&scene=1&srcid=1124CU3HYpolavYaWAzawhlu#rd';
var CampIndex = React.createClass({
  mixins: [Reflux.listenTo(LoginStore,'onUserChange')],

  getInitialState() {
    return ({
      list: [],
      lastArticle: [],
      show: false,
      courses: [], //学生课程信息
      reload: false,
      banner: false
    })
  },


  onUserChange(obj) {
    this.getPalyList();
    this.getData();
    this.getCourseList();
  },

  componentDidMount() {
    this.getPalyList();
    this.getData();
    this.getCourseList();
    logger.log({
      target: 'camp.index'
    });
  },
  getData() {
    /* 文章推荐数据 */
    CampModal.getLatest(result => {
      let {
        data,
        status
        } = result;
      if (status) {
        this.setState({
          lastArticle: data
        });
      }
    });
    /* 更多推荐*/
    CampModal.getMore(result => {
      let {
        data,
        status
        } = result;
      if (status) {
        this.setState({
          moreArticle: data
        });
      }
    });
  },
  getPalyList() {
    CampModal.getForumList(6, (list) => {
      this.setState({list: list})
    });
  },
  openVideo(id) {
    CampModal.addPlayNums(id, () => {
      this.getPalyList();
    });
  },

  //查询该用户已参加课程
  getCourseList() {
    let uid = UserInfo.get().data.user_id;
    if (uid) {
      SummerModel.getUserInfo(uid, result => {
        let {
          status=true,
          data: {
            courses
          }
        } = result;
        let obj1 = _.find(courses, ['course_id', 5]);
        let obj2 = _.find(courses, ['course_id', 6]);
        let isbanner = false;
        if (obj1 && obj2) {
          isbanner = true;
        }

        this.setState({
          courses: courses || [],
          isbanner: isbanner
        });

      });
    }
  },

  //报名
  enrol() {
    DialogAction.open(Dialog.Enrol);
  },

  enrolBind() {
    let uid = UserInfo.get().data.user_id;
    if (uid) {
      DialogAction.open(Dialog.EnrolBind);
    }
    else {
      DialogAction.open(Dialog.WechatLogin);
    }

  },

  //banner
  renderBanner() {
    return (
      <div className="banner animated fadeIn">
        {
          this.state.isbanner?(
            <div className="banner-warp-success"></div>
          ):(
            <div className="banner-warp">
              <a className="xly-btn"
                 href="javascript:;"
                 onClick={this.enrol}
              >
                点击报名
              </a>
              <a className="xly-btn1"
                 href="javascript:;"
                 onClick={this.enrolBind}
              >
                我已报名
              </a>
            </div>
          )
        }
      </div>
    );
  },

  isShow() {
    this.setState({
      show: !this.state.show
    });
  },

  isHref(isOpen, index) {
    Model.userinfo(data => {
      if (UserInfo.get().status) {
        let is = false;
        let uri = '';
        let {
          state: {
            courses = []
          }
        } = this;
        const targetMap = {
          1: 'camp.class.click.spring2016',
          2: 'camp.class.click.summer2016',
          3: 'camp.class.click.autumn2016',
          4: 'camp.class.click.autumnpro2016',
          5: 'camp.class.click.winter2016',
          6: 'camp.class.click.winterData2016'
        };
        const _href = {
          1: 'http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=503513967&idx=1&sn=3c1762c2af0b7059919200014f99ac2f&chksm=04b0e56133c76c7764bc9db0b3fe053fa953e889f787db8540f2ce56e09e05eb7b57a1a4535b&mpshare=1&scene=23&srcid=12087xAvxs1z0o4rmHFJGw8s#rd',
          2: 'http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=2650997684&idx=2&sn=5d732f839b4375ce2512c2d5e04ccb3f#rd',
          3: 'http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=400550076&idx=1&sn=c49580bc822b2cc3f4642fcc85df8907&chksm=0d6c0eb23a1b87a4c5ea497e3ef31d6ba25fe36337ec4c7c85f696c7fea0c3bf293a82dc9ccc&mpshare=1&scene=23&srcid=1208jrGEnsHKyQuyzQCNxZf4#rd',
          4: 'http://mp.weixin.qq.com/s?__biz=MzA3ODE0MDI1Nw==&mid=2650998975&idx=1&sn=36376493a538695d5293989665d9e0b0&chksm=84b0eeb1b3c767a7b53b30eb4ff089f6fef2f0c1eaba5b449d109288a22232bd16dca7dc594f#rd',
          5: url,
          6: 'http://mp.weixin.qq.com/s/Wxh-5YMB8eEEXrK9YiTjCg'
        }

        logger.log({
          target: targetMap[index]
        });

        if (courses.length) {
          let obj = _.find(courses, ['course_id', index]);
          if (obj) {
            is = true;
            uri = `/#/camps/${index}`;
          }
        }
        is? window.location.href = uri: window.open(_href[index]);
      }
      else {
        DialogAction.open(Dialog.WechatLogin);
      }
    });
  },
  /* 炒股能手必修课*/
  renderPanelTop() {
    let {
      state: {
        courses
      }
    } = this;

    return (
      <div className="camp-panel animated fadeIn">
        <div className="camp-panel-title">
          <h2>炒股能手必修课</h2>
        </div>
        <div className="camp-panel-body">
          <a href="javascript:;" onClick={() => {
              this.isHref(false,6);
            }}
             className="btn-img-a"
          >
            <div className="btn-img-item">
              {
                _.find(courses, ['course_id', 6])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/dlydata.png"/>
            </div>
          </a>
          <a href="javascript:;" onClick={() => {
            this.isHref(false,5);
            }}
             className="btn-img-a"
          >
            <div className="btn-img-item">
              {
                _.find(courses, ['course_id', 5])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/dly.png"/>
            </div>
          </a>
          <a href="javascript:;" onClick={() => {
            this.isHref(false,4);
            }}
             className="btn-img-a"
          >
            <div className="btn-img-item">
              {
                _.find(courses, ['course_id', 4])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/qxyPro.png"/>
            </div>
          </a>
          <a href="javascript:;"
             onClick={() => {
                 this.isHref(false,3);
               }}
             className="btn-img-a"
          >
            <div className="btn-img-item m0"
            >
              {
                _.find(courses, ['course_id', 3])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/qxy.png"/>
            </div>
          </a>
          {this.state.show?(
          <a href="javascript:;"
             onClick={() => {
                 this.isHref(false,2);
               }}
             className="btn-img-a animated slideInDown"
          >
            <div className="btn-img-item " >
              {
                _.find(courses, ['course_id', 2])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/xly.png"/>
            </div>
          </a>
          ):(
             <noscript />
           )}
          {this.state.show?(
          <a href="javascript:;"
             onClick={() => {
                 this.isHref(false,1);
               }}
             className="btn-img-a animated slideInDown"
          >
            <div className="btn-img-item" >
              {
                _.find(courses, ['course_id', 1])?
                (<img alt="已参加" src="/images/rightTop.png" className="camp-isbm"/>):
                ( <noscript />)
              }
              <img src="/images/cxy.png"/>
            </div>
          </a>
          ):(
             <noscript />
           )}
          <a className="xly-more "
             href="javascript:;"
             onClick={this.isShow}
          >
            查看更多
          </a>
        </div>
      </div>
    );
  },
  /* 文章推荐 */
  renderPanelLeftTop() {
    let {
      state: {
        lastArticle = []
        }
      } = this;
    return (
      <div className="camp-panel-sm fll animated fadeIn">
        <div className="camp-panel-title">
          <h2>文章推荐</h2>
        </div>
        <div className="camp-panel-body">
          {
            lastArticle.map((item, k) => {
              return <div className="btn-article-item" key={k}>
                <a href={item.wechat_link} target="_blank">
                  <div className="btn-article-img">
                    <img src={item.image_file}/>
                  </div>
                  <div className="btn-article-detail">
                    <p className="btn-article-title text-overflow">
                      {item.title}
                    </p>
                    <p className="btn-article-info ">
                      {item.digest.length>=19?item.digest.substr(0,18)+'...':item.digest}
                    </p>
                  </div>
                </a>
              </div>
              })
            }
        </div>
      </div>
    );
  },
  /* 大咖讲堂 */
  renderPanelLeftBottom() {
    let {
      state: {
        list = []
        }
      } = this;
    return (
      <div className="camp-panel-sm fll animated fadeIn">
        <div className="camp-panel-title">
          <h2>大咖讲堂</h2>
        </div>
        <div className="camp-panel-body">

          {
            list.map((item, k) => {
              return <div className="btn-video-item fll">
                <a href={`#/campPlay/${item.id}`}
                   className="btn-video-link"
                   target="_blank"
                   onClick={() => this.openVideo(item.id)}
                   key={k}
                >
                  <div className="btn-video-img">
                    <img alt="play" src={item.img_addr} className="btn-video-pic"/>
                    <i className="fa fa-play-circle-o btn-video-play"/>
                  </div>
                  <div className="btn-video-detail">
                    <p className="btn-video-title text-overflow">{item.title}</p>
                    <span className="btn-video-count">{item.video_play_times}次</span>
                  </div>
                </a>
              </div>

              })
            }

        </div>
      </div>
    );
  },
  /* 更多推荐 */
  renderPanelRight() {
    let {
      state: {
        moreArticle = []
      }
    } = this;

    return (
      <div className="camp-panel-xs flr animated fadeIn">
        <div className="camp-panel-title">
          <h2>更多推荐</h2>
        </div>
        <div className="camp-panel-body">
          <ul className="article-list">
            {
              moreArticle.map((item, k) => {
                return <li className="text-overflow" key={k}>
                  &#183;&nbsp;
                  <a href={item.wechat_link} target="_blank">
                    {item.title}
                  </a>
                </li>
                })
              }
          </ul>
        </div>
      </div>
    );
  },

  render() {
    return (
      <div className="camp-warp">
        {this.renderBanner()}
        <div className="camp">
          {this.renderPanelTop()}
          {this.renderPanelLeftTop()}
          {this.renderPanelRight()}
          {this.renderPanelLeftBottom()}
        </div>
      </div>
    )
  },
});
module.exports = CampIndex;

// entry代码，看情况放回去，或者把整个老训练营代码删掉
// var React = require('react');
// var Head = require('../component/head');
// var Foot = require('../component/foot');
// var CampIndex = require('../page/campIndex');
// require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
// require('../../style/entry/campIndex.scss');
// require('../plugin/font.jsx');

// React.render(
//     <div>
//         <Head type='small' item='msg'/>
//         <CampIndex />
//         <Foot />
//     </div>, 
// $('#content')[0]);
