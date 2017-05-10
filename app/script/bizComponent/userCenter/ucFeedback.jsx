/**
 * 意见反馈
 * @type {*|exports|module.exports}
 */
var React = require('react');
var pageEnum = require('./config');
var If = require('../../component/if');
var userModel = require('../../model/userModel').default;
var LoginActions = require('../../action/loginAction');
var AlertActions = require('../../action/alertAction');
var MessageModel = require('../../model/messageModel');
var DialogAction = require('../../action/dialogAction');
var FeedbackType = pageEnum.FeedbackType;

var UcFeedback = React.createClass({

  getInitialState() {
    return{
      page: this.props.page, //显示页面
      issueText: '',
      issueItem: '',
      msgList: [],
      userInfo: this.props.userInfo, //用户信息
    }
  },

  componentWillMount() {
    this.getMsgs();
  },

  getMsgs() {
    let {page} = this.state;
    let {feedback, message} = pageEnum.userAccount;
    if(page == message){
      MessageModel.getFeedbacks((feedbacks) => {
        MessageModel.getMessages((msgs) => {
          this.setState({msgList: feedbacks.concat(msgs) })
        });
      });
    }
  },

  changePage(page) {
    this.setState({page: page}, () => {
      this.getMsgs();
    });
  },

  render() {
    let {page} = this.state;
    let {feedback, message} = pageEnum.userAccount;
    return(
      <div className="uc-panel-body">
        <div className="uc-left-menu">
          <ul className="uc-nav">
            <li className= {page == feedback ? 'uc-left-active' : '' }  onClick= {() => this.changePage(feedback)}>意见反馈</li>
            <li className= {page == message ? 'uc-left-active' : '' } onClick= {() => this.changePage(message)}>站内信&nbsp;&nbsp;&nbsp;</li>
          </ul>
        </div>

        <div className="uc-right-content">
          <If when = {page == feedback} >
            {this.renderFeedback()}
          </If>

          <If when = {page == message} >
            {this.renderMessage()}
          </If>
        </div>
      </div>
    )
  },

  /**
   * 意见反馈
   */
  renderFeedback() {
    let {issueItem, issueText} = this.state;
    return (<div>
      <div className="uc-row">亲爱的九斗用户</div>
      <div className="uc-row">请在下面填写您遇到的问题或意见建议，感谢您对我们的支持!</div>
      <div className="uc-row mb0">
        <ul className="uc-box-item">
          <li>
            <input type="radio" name="issueItem" value="1" id="item1" onChange={this.setValue}/>
            <label htmlFor="item1">{FeedbackType['1']}</label>
          </li>
          <li>
            <input type="radio" name="issueItem" value="3" id="item3" onChange={this.setValue}/>
            <label htmlFor="item3">{FeedbackType['3']}</label>
          </li>
          <li>
            <input type="radio" name="issueItem" value="4" id="item4" onChange={this.setValue}/>
            <label htmlFor="item4">{FeedbackType['4']}</label>
          </li>
        </ul>
          <div className="issue-warp">
            <textarea className="issue-text" name="issueText" onChange={this.setValue} placeholder="其他问题，请在此输入" >{issueText}</textarea>
            <If when = {issueItem && issueText}>
              <span className="uc-btn flr mr30 mt10" onClick={this.onSend}>提交反馈</span>
            </If>
            <If when = {!(issueItem && issueText)}>
              <span className="uc-btn flr mr30 mt10 uc-btn-disabled" >提交反馈</span>
            </If>
          </div>
      </div>
    </div>)
  },

  //站内信
  renderMessage() {
    return(
      <ul className="uc-msg">
        {this.renderItem()}
      </ul>
    )
  },

  renderItem() {
    let {msgList} = this.state;
    var list  =  [];
    var newDate = new Date();

    for(let index in msgList) {
      let item = msgList[index];
      let openClazz = item.open ? '' : 'hide';

      if(item.feedback_id) { //反馈信息
        let content = item.content;
        //let title = `您上次关于"${FeedbackType[item.choose]}"的反馈已经回复,点击查看!`;
        let date = new Date(parseInt(item.db_insert_time)*1000);
        let dateStr = newDate.Format('yyyyMMdd') == date.Format('yyyyMMdd') ?
          date.Format('hh:mm') : date.Format('yyyy/MM/dd');

        let title = `您${new Date(parseInt(item.db_feedback_time)*1000).Format('yyyy/MM/dd日')}提交的反馈已经回复`;

        if(!item.open) {
          title += ',点击查看';
        }

        list.push(
          <li >
            <i onClick= {(e) => this.fbHasRead(index)} className={`iconfont icon-xiaoxi ${item.reply_status == '0' ? 'icon-active' :''}`} />
             <span onClick= {(e) => this.fbHasRead(index)} className="uc-msg-line mt8">
               <span className="uc-msg-title">{title}</span>
               <span className="uc-msg-date">{dateStr}</span>
             </span>
             <span className={`uc-msg-detail ${openClazz}`}>
             <div className="uc-msg-content">
               <div>您的意见反馈:</div>
               <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.des.length > 68 ? item.des.substr(0,68)+'...' : item.des}</div>

               <div className="mt10 color-bule">九斗客服答复:</div>
               <div className="color-bule">
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{content}
               </div>

             </div>
               <span>以上是否解决您的问题?</span>
            </span>
            <div className={`uc-btn-tool ${openClazz}`} >
              <If when = {item.reply_status == '3'} >
              <a className="uc-btn-disabled" href="javascript:;">
                已解决
              </a>
              </If>
              <If when = {item.reply_status != '3'} >
                <a onClick= {(e) => this.fbResolve(index) } className="uc-btn" href="javascript:;">
                  已解决
                </a>
              </If>

              <If when = {item.reply_status < '2'} >
              <a className="uc-btn" href="javascript:;" onClick = {() => this.linkService(index)}>
                未解决
              </a>
              </If>

              <If when = {item.reply_status >= '2'} >
                <a className="uc-btn-disabled" href="javascript:;" >
                  未解决
                </a>
              </If>

            </div>
          </li>
        );

        if(item.open && item.user_contact_custom_service) {
          list.push(
            <li className="no-borer">
              <div className="uc-link-phone">
                <div className="fll">
                  <img src="/images/erweima.jpg" style={{width:120}}/>
                </div>
                <div className="text">
                  请用微信扫描二维码,<br/>
                  直接联系九斗客服
                </div>
              </div>
            </li>
          );
        }

      }else{//系统站内信
        let title = item.content.substr(0,20);

        let date = new Date(parseInt(item.msg_time)*1000);
        let dateStr = newDate.Format('yyyyMMdd') == date.Format('yyyyMMdd') ?
          date.Format('hh:mm') : date.Format('yyyy/MM/dd');

        if(item.content.length > 20) {
          title += '...';
        }
        list.push(
          <li >
            <i onClick = {(e) => this.msgHasRead(index)} className={`iconfont icon-xiaoxi ${item.status == '0' ? 'icon-active' :''}`} />
            <span onClick = {(e) => this.msgHasRead(index)} className="uc-msg-line mt8">
               <span className="uc-msg-title">{title}</span>
               <span className="uc-msg-date">{dateStr}</span>
            </span>
            <span className={`uc-msg-detail ${openClazz}`}>{item.content}</span>
          </li>
        );
      }
    }


    return list;
  },

  //提交反馈
  onSend() {
    let {issueItem, issueText} = this.state;

    if(!issueItem){
      AlertActions.error('请填写必填项', '反馈提交');
      return;
    }

    let obj ={
      choose:[issueItem].toString(),
      desc:issueText.trim(),
      url:window.location.hash,
    }
    UserModel.userFeedback(obj,data=>{
      if (data.status) {
        this.setState({
          issueItem: null,
          issueText: '',
          error:'',
        });
        AlertActions.success('感谢您的意见建议，九斗会在一天内将对于您问题的回复发到站内信中', '反馈提交');
        DialogAction.close();
      }else {
        AlertActions.error('提交失败,请联系管理员', '反馈提交');
      }
    });
  },

  //反馈已读
  fbHasRead(index) {
    let {msgList} = this.state;

    for(var i in msgList) {
      if(i != index) {
        msgList[i].open = false;
      }
    }

    let item = msgList[index];
    let {userInfo} = this.state;
    let {
      feedback_id,
      reply_status,//已读未读
      reply_id,
      open,//是否打开
      } = item;

    if(reply_status == '0'){
      MessageModel.hasReadFeedback(reply_id, () =>{});
      item.reply_status = '1';
      userInfo.unreadmsg--;
      LoginActions.Replace(userInfo);
    }

    item.open = !open;

    this.setState({msgList: this.state.msgList});
  },

  //反馈已解决
  fbResolve(index) {
    let item = this.state.msgList[index];
    let {
      feedback_id,
      reply_status,//是否已解决
      reply_id,
      } = item;

    if(reply_status != '3'){
      MessageModel.resolveFeedback(reply_id, () =>{});
      item.reply_status = '3';
    }

    this.setState({msgList: this.state.msgList});
  },

  //消息已读
  msgHasRead(index) {
    let item = this.state.msgList[index];
    let {userInfo} = this.state;
    let {
      message_id,
      status,//已读未读
      open,//是否打开
      } = item;

    if(status == '0'){
      MessageModel.hasReadMessage(message_id, () =>{});
      userInfo.unreadmsg--;
      LoginActions.Replace(userInfo);
    }

    item.open = !open;
    item.status = '1';

    this.setState({msgList: this.state.msgList});
  },

  //联系客服
  linkService(index) {
    let item = this.state.msgList[index];
    let {
      user_contact_custom_service,//联系客服,现在用来打开客服
      reply_status,
      reply_id,
      } = item;

    if(reply_status < '2'){
      MessageModel.hasLinkService(reply_id, () =>{});
      item.reply_status = '2';
    }

    item.user_contact_custom_service = !user_contact_custom_service;

    this.setState({msgList: this.state.msgList});
  },

  //设置state USER值
  setValue: function(e) {
    var data ={};
    var name = e.currentTarget.attributes.name.value,
      value = e.target.value;

    data[name] = value;
    this.setState(data);
  },

});

module.exports = UcFeedback;
