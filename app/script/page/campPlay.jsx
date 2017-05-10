'use strict';
/**
 * 大咖讲堂 视频也
 * @type {*|exports|module.exports}
 */
var React = require('react');
var Reflux = require('reflux');
var If = require('../component/if');
var CampModal = require('../model/campModel');
var AlertActions = require('../action/alertAction');
var DialogStore = require('../store/dialogStore');
var DialogAction = require('../action/dialogAction');
var Dialog = DialogAction.Dialog;
var YKUPlayer = require('../util/player');
var Title = require('../component/title');
var LoginStore = require('../store/loginStore');
var _ = require('_');
var Pager = require('react-pager');
var Loading = require('../component/loading');
var logger = require('../util/logger');
var url = require('../util/url');
var moment = require('moment');

var CampPlay = React.createClass({

  mixins: [
    Reflux.connect(LoginStore,'userInfo')
    ],

  getInitialState() {
    this.unDialogscribe = DialogStore.listen(this.displayViod)
    return({
      id: this.getID(),
      loaded: false,
      list: [] , // 视频列表
      userInfo: {}, // 用户信息
      forum: {}, // 视频信息
      commentsData: {// 评论
        total_count: 0,
        comments: [],
      },
      page: 0, // 评论当前页数
      num_per_page: 20, // 显示评论条数
      content: '', //发表内容
      maxLength : 300, //最多评论数

      displayViod: true, //显示视频
    })
  },

  getID() {
    return url.getSearch('id');
  },

  componentWillUnmount(){
    this.unDialogscribe();
  },

  //关闭dialog监听
  displayViod(data) {
    let dialog = data[0];
    switch(dialog) {
      case Dialog.Close :
        this.setState({displayViod:true}); break;
      case Dialog.WechatLogin :
        this.setState({displayViod:false}); break;
    }

  },

  componentDidMount() {
    logger.log({
      target: 'camp_play_pv'
    });

    CampModal.getForum(this.state.id, (forum) => {
      CampModal.getForumList(7+1, (list) => {

        this.setState({
          forum: forum ,
          loaded: true,
          list: list,
        },() => {
          //加载优酷视频
          YKUPlayer.play(forum.video_url);
        });
        this.getComments();
      });

    });
  },

  getComments() {
    var {page, num_per_page, forum} = this.state;
    CampModal.getComments(forum.id, page + 1, num_per_page, (commentsData) => {
      this.setState({commentsData: commentsData});
    })
  },

  addComment() {
    var {content, forum, userInfo} = this.state;
    var needLogin = _.isEmpty(userInfo);

    if(needLogin) {
      DialogAction.open(Dialog.WechatLogin);
      return;
    }

    if(content.length > 0){
      CampModal.postComment(forum.id, content, (results) => {
        if(results.status) {
          AlertActions.success('发表成功','发表评论');
          this.getComments();
          this.setState({content:''});
        }else {
          AlertActions.error(`发表失败: ${results.message}`,'发表评论');
        }
      })
    }else {
      AlertActions.error(`内容不能为空`,'发表评论失败');
    }

  },

  //设置state值
  setValue: function(e) {
    var data = {};
    var name = e.currentTarget.attributes.name.value;
    var value = e.target.value;
    var {maxLength} = this.state;

    data[name] = value.trim();

    if(data[name].length > maxLength){
      AlertActions.error(`字数过多,总数不能超过${maxLength}`,'编辑失败');
      data[name] = data[name].substring(0, maxLength);
    }
    this.setState(data);
  },

  render() {
    let {video_url, title, video_play_times, id} = this.state.forum;

    let {loaded, displayViod} = this.state;

      return(
        <div className="page mt30">

          <Title title={title} >
            <Title.Right>

              <div className="bdsharebuttonbox camp-pay-title">
                <a href="#" className="bds_qzone" data-cmd="qzone" alt="QQ空间"></a>
                <a href="#" className="bds_tsina" data-cmd="tsina" alt="新浪"></a>
                <a href="#" className="bds_weixin" data-cmd="weixin" alt="微信"></a>
              </div>

            </Title.Right>
          </Title>

          <Loading loaded={loaded}>
          <div className={displayViod ?'camp-play ' :'camp-play camp-play-hidden'} id="youkuplayer"></div>
          </Loading>

          {this.renderRecommend()}

          {this.renderAddComment() }

          {this.renderComments()}

        </div>
      )
  },

  //更多推荐
  renderRecommend() {
    let {list, forum} = this.state;

    let elist = [];

    for(let i in list) {
      var _f = list[i];
      if(forum.id != _f.id) {
        elist.push(
          <li>
          <a href={`#/campPlay/${_f.id}`} onClick={() => {CampModal.addPlayNums(_f.id) } }  className="item msg-marquee" target="_blank">
            <img src={`${_f.img_addr_small}`} />
            <div className="msg-bg"></div>
            <div className="msg-brief ">
              <span>{_f.brief}</span>
              <div className="marquee">{_f.brief}</div>
            </div>
          </a>
          </li>
        )

      }
    }

    return(
      <div className="mt30">

        <Title title="更多推荐" />

        <div className="camp-forum" >
          <ul>
          {elist}
          </ul>

        </div>
    </div>)
  },

  //发表评论
  renderAddComment() {
    var {userInfo, content, maxLength} = this.state;
    var needLogin = _.isEmpty(userInfo);
    var date = moment().format('hh:mm');

    return(
      <div className="add-comment">
        <div className="title">
          <img src="/images/small-logo.png" className="logo"/>

          <span className="name">{needLogin ? '匿名用户' :userInfo.username}</span>
          <span className="time">{date}</span>

          <If when= {needLogin}>
          <a className="login" href="javascript:;" onClick={() => DialogAction.open(Dialog.WechatLogin)}>登录 | 注册</a>
          </If>
          <span className="flr">{content.length} / {maxLength}</span>

        </div>
        <textarea name="content" onChange= {this.setValue} placeholder="请发表评论" value={content}></textarea>
        <a href="javascript:;" className="jd-btn jd-btn-white flr mt20" onClick={this.addComment}>
          发表评论
        </a>
      </div>
    )
  },

  //评论
  renderComments() {
    var {
      page,
      num_per_page,
      commentsData : {
        comments,
        total_count
        },
      } = this.state;

    let list = [];

    let newDate = new Date();
    for(let i in comments) {
      let comment = comments[i];
      let pushDate = new Date(parseInt(comment.comment_time)*1000);
      var dateMoment = moment(pushDate);

      pushDate = moment().format('yyyyMMdd') == dateMoment.format('yyyyMMdd') ?
             dateMoment.format('hh:mm') : dateMoment.format('MM/dd hh:mm');

      list.push(
        <div className="comment-item">
          <div className="title">
            <img src="/images/small-logo.png" className="logo"/>

            <span className="name">{comment.user_name}</span>
            <span className="time">{pushDate}</span>
          </div>


          <div className="content">
            {comment.content}
          </div>

        </div>
      )
    }

    let total = parseInt((parseInt(total_count)    + num_per_page -1) / num_per_page) ;

    return (
      <div className="mt30">
        <Title title="精选评论" >
          <Title.Right>
            <span style= {{fontSize: 24}}>{total_count} </span>条评论
          </Title.Right>
        </Title>

        <div className="camp-comment">

        {list}


        <div className="custom_pagination">

        <Pager total={total}
               current={page}
               titles={{
                             first:   '<<',
                             prev:    '<',
                             prevSet: '...',
                             nextSet: '...',
                             next:    '>',
                             last:    '>>'
                         }}
               visiblePages={5}
               onPageChanged={(newPage) => {
               this.setState({page: newPage},() => {
                  this.getComments()
                  })
               }}/>


        </div>
        </div>

      </div>
    )
  }



});

module.exports = CampPlay;

// entry代码，看情况放回去，或者把整个老训练营代码删掉
// var React = require('react');
// var Head = require('../component/head');
// var Foot = require('../component/foot');
// var CampPlay = require('../page/campPlay');
// require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
// require('../../style/entry/campPlay.scss');
// require('../plugin/font.jsx');

// React.render(
//     <div>
//         <Head type='small' item='msg'/>
//         <CampPlay />
//         <Foot />
//     </div>, 
// $('#content')[0]);
