/**
 * 并购重组请求
 */

"use strict";
const http = require('../util/http.js');
const _ = require('_');
const SliderActions = require('../actions/SliderActions');
const logger = require('../util/logger');
const LoginActions = require('../actions/LoginActions');
const UserInfo = require('../util/userInfo');
var MessageModel = require('../model/messageModel');
import Storage from '../util/storage';

export default class MergerModal {
  constructor(){
    SliderActions.getInitRange();
  }
  onAutoGet(val, cb) {
    let url = `/merger/querysearch?condition=${val}`;
    http.get(url, (err, data)=> {
      let relust = err ? {} : http.searchFilter(data);
      return cb(relust);
    });
  }
  // 并购重组初始化筛选条件
  initConditionsearch(cb) {
    let url = '/merger/events?after_date=20160101&page_size=15';
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  toStr(obj) {
    let str = '';
    let list =obj;
    let key = '';
    let {_keyMap} = window;
    let _list = [];
    for (let i = 0; i < list.length; i++) {
      key = list[i];
      if (key.showVal && key.showVal.length>0) {
        _list = key.showVal;
      } else {
        _list= [_keyMap[key.key].x[key.range[0]],_keyMap[key.key].x[key.range[1]]];
      }
      str += `${key.key}=${_list.toString()}&`;
    }
    return str;
  }
  // 并购并购重组条件筛选
  conditionsearch(slider, check, page, cb) {
    let strSilder = '';
    let strCheck = '';
    let strPage = '';
    strSilder = this.toStr(slider);
    // `${slider[i].key}=${slider[i].range.toString()}&`;
    for (let j = 0; j< check.length; j++) {
      strCheck += `${check[j].key}=${check[j].val.toString()}&`;
    }
    strPage = `page_num=${page}&page_size=15&after_date=20160101`;
    let url = `/merger/events?${strSilder}${strCheck}${strPage}`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  baseInfo(id, cb) {
    let url = `/merger/events/${id}/base_info`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  // 获取一个并购事件的进程信息 k线图
  commitment(id,cb) {
    let url = `/merger/events/${id}/commitment`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  procedure(event_id,cb){
    let url = `/merger/events/${event_id}/procedure`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  fundament(event_id,cb){
    let url = `/merger/events/${event_id}/fundament`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  // 获取一个并购事件的并购方案
  program(id,cb){
    let url = `/merger/events/${id}/program`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  // 用户相关接口
  login(user, cb) {
    let url = '/user/webapi/login';
    let obj = {
      'LoginForm[username]':user.uname,
      'LoginForm[password]':user.pwd
    };
    http.post(url,obj,(err, data)=> {
      var storage = new Storage()
      storage.setStore('USER_ID', data.data.user_id || '');
      UserInfo.set(data);
      return cb(data);
    });
  }
  logOut(cb){
    let url = '/user/webapi/logout';
    http.get(url,(data)=>{
      return cb(data);
    });
  }
  signup(user,cb){
    let url = '/user/webapi/signup';
    let obj = {
      'SignupForm[unique_id]':user.uname,
      'SignupForm[password]':user.pwd,
      'SignupForm[password_repeat]':user.repwd
    };
    http.post(url,obj,(err, data)=> {
      return cb(data);
    });
  }
  userinfo(cb){
    let url = `/user/webapi/get-userinfo`;

    const storage = new Storage();

    /* storage.removeStore('USER_ID');*/

    http.get(url,(err,data)=>{
      MessageModel.getUnreadmsg((unreadmsg) => {
        if(data.data){
          data.data.unreadmsg = unreadmsg;
        }
        LoginActions.setUser(data);
        if (data) {
          storage.setStore('USER_ID', data.data.user_id || '');
        }
        UserInfo.set(data);
        return cb(data);
      });
    });
  }
  updateUserName(name,cb) {
    let url = '/user/webapi/modify-userinfo';
    let obj = {
      'ModifyUserForm[username]':name
    }
    http.post(url,obj,(err,data)=>{
      return cb(data);
    });
  }
  updatePassword(obj,cb){
    let url = '/user/webapi/modify-password';
    http.post(url,obj,(err,data)=>{
      return cb(data);
    });
  }
  emailVerify(obj,cb){
    let url = '/user/webapi/email-registeration';
    http.post(url,obj,(err,data)=>{
      return cb(data);
    });
  }
  verify(token,cb){
      let url = `/user/webapi/verify?token=${token}`;
      http.get(url,(err,data)=>{
        return cb(data);
      });
  }
  applyReset(email,cb){
      let url = '/user/webapi/apply-reset';
      let obj = {
        'PasswordResetRequestForm[email]':email
      }
      http.post(url,obj,(err,data)=>{
        return cb(data);
      });
  }
  wechatParams(cb){
    let url = '/wechat-connect/qrrequest?' + Math.random();
    http.get(url,(err,data)=>cb(data));
  }
  userFeedback(obj,cb){
    let url = '/feedback/submit';
    http.post(url,obj,(err,data)=>cb(data));
  }

  //点击事件
  saveClickEve(tag) {
    var storage = new Storage();
    storage.setCookie('need_log_by_reg', tag);
  }

  //发送注册PV来源
  sendRegisterLog() {
    var storage = new Storage();
    var val = storage.getStore('need_log_by_reg');
    switch (val){
      case 'user_register_by_click_yestoday' : // 用户在未登录状态下通过点击上一天注册登陆
      case 'user_register_by_click_goodAndBad' : // 用户在未登录状态下通过点赞或者点踩注册登陆
      case 'user_register_by_click_stock' :  // 用户通过添加自选股注册登陆
      case 'user_register_by_click_macro' : // 用户通过点击每日贴士注册登陆
        this._sendRegisterLog(val);

    }

    storage.removeStore('need_log_by_reg');
  }

  _sendRegisterLog (tag){
    logger.log({
      target: 'user_register_pv',
    });
    logger.log({
      target: tag,
    });
  }

  //个人积分
  getScope(callback) {
    var url = `/doumi/info`;
    http.get(url, (err, data) => callback(data));
  }

  //是否需要验证邮箱
  needValidateEmail() {
    var storage = new Storage();
    let emailToken = storage.getStore('emailToken');
    if(/token=.*verify=/.test(window.location.search)) { //需要验证邮箱
      //保存token
      let {search} = window.location;
      let token = search.substr(search.indexOf('token='),search.indexOf('&')-1);
      storage.setStore('emailToken',token);

      window.history.pushState({}, 0, window.location.origin+"/#/");

      return true;
    }else if(emailToken) {
      return true;
    }

    return false;
  }

  //是否进行邮箱验证
  validateEmail(callback) {
    var storage = new Storage();
    //发送验证
    let emailToken = storage.getStore('emailToken');

    let url = `/user/webapi/verify?${emailToken}`;

    http.get(url, (err, data) => { callback(data || {
        status: false,
        message: `验证失败 code: ${err.status}`,
      })})

    //删除 emailToken
    storage.removeStore('emailToken');

  }

}

// export default new MergerModal();
