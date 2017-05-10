/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "春令营－接口－copy春训营的，就是多了前缀"
 */

"use strict";

const http = require('../util/http');
const $ = require('jquery');

var DiagnosedModel = {

  // 获取诊断人列表
  Doctors: function( cb) {
    const url = '/stockinfogate/trdiagnosis/doctors';
    http.get(url, (err, result) => cb(result));
  },

  // 获取诊断用户信息接口
  Customer: function( cb) {
    const url = '/stockinfogate/trdiagnosis/customer';
    http.get(url, (err, result) => cb(result));
  },

  //更新诊断用户信息接口
  postRequest: function(obj, cb) {
    const url = '/stockinfogate/trdiagnosis/request';
    http.post(url, obj, (err, result) => cb(result));
  },

  // 诊断事件列表
  getEvents: function(cb) {
    const url = '/stockinfogate/trdiagnosis/events';
    http.get(url, (err, result) => cb(result));
  },



}

module.exports = DiagnosedModel;
