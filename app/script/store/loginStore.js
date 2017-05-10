"use strict";
const Reflux = require('reflux');
const LoginActions = require('../action/loginAction');
const ReloadAction = require('../action/reloadAction');
import Storage from '../util/storage';
const _storage = new Storage();
const _ = require('_');
import MergerModal from '../model/userModel';
const UserInfo = require('../util/userInfo');
var MessageModel = require('../model/messageModel');

const LoginStore = Reflux.createStore({
  listenables: [LoginActions],
  userInfo: {},
  _href: '',
  time: 0,

  _trigger: function(data) {
    let timeLag = new Date().getTime() - this.time;
    this.time = new Date().getTime();
    this.trigger(data);
  },

  init: function() {
    this._href = window.location.hash;
    this.userInfo = new Storage().getStore('c_userInfo') || {};
  },
  onUserInfo: function() {
    this._trigger(this.userInfo);
  },

  onReload: function() {
    this._trigger('reload');
  },

  onGetUser: function() {
    new MergerModal().userinfo((data) => {
      if (data.status) {
        this.userInfo = data.data;

        //新数据
        this.userInfo.accumulative_login_times = data.accumulative_login_times;
        this.userInfo.latest_login_date = data.latest_login_date;
        this.userInfo.lock_value = data.lock_value;
        this.userInfo.successive_login_times = data.successive_login_times;
        //end

        new Storage().setStore('c_userInfo', data.data);
        UserInfo.set(data);
      }

      this._trigger(this.userInfo);

    });
  },
  onSetUser: function(data) {
    this.userInfo = data.data;

    //新数据
    this.userInfo.accumulative_login_times = data.accumulative_login_times;
    this.userInfo.latest_login_date = data.latest_login_date;
    this.userInfo.lock_value = data.lock_value;
    this.userInfo.successive_login_times = data.successive_login_times;
    //end

    new Storage().setStore('c_userInfo', data.data);
    this._trigger(this.userInfo);
  },
  onReplace: function(data) {
    this.userInfo = data;
    this._trigger(this.userInfo);
  },
  //   传入参数为true时，做this.triiger()操作；
  onClearUser: function(arg) {
    new MergerModal().logOut(data => {
        //cl
        _storage.removeStore('USER_ID');
        _storage.removeStore('paramsUrl');
        _storage.removeStore('tabActive');
        _storage.removeStore('checkVir');
        _storage.removeStore('c_userInfo');
        if (arg) {
            this.userInfo = {};
            this._trigger(this.userInfo);
          window.location.reload();
        }
      ReloadAction.load();
    });
  },


});

module.exports = LoginStore;
