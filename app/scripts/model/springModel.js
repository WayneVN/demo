/**
 * 春训营－我的帐户-个人作业列表
 * @author chenmin@joudou.com
 */
"use strict";

const http = require('../util/http');
const $ = require('jquery');

var SpringModel = {

  // 获取当前用户信息
  studentsUserInfo: function (uid,cb) {
    const url = `/students/userInfo?uid=${uid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 作业列表
  getJobList: function (uid,cb) {
    const url = `/students/jobList?uid=${uid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 查看批改结果
  jobComments: function (uid,jobid,cb) {
    const url =  `/students/jobComments?uid=${uid}&job_id=${jobid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  //  学生上传作业答案 Post
  jobUpload: function (obj,cb) {
    const url = '/students/jobUpload';

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  // 获取作业列表－－任何权限都能看到
  jobQuestions: function (uid,cb) {
    const url = `/students/jobQuestionList?uid=${ uid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 需要权限认证
  jobAnswers: function (uid,cb) {
    const url = `/students/jobAnswers?uid=${ uid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 报名
  userRegister: function (obj, cb) {
    const url = `/students/userRegister`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  //  助教－查看所有用户作业
  assitStudentsJob: function(uid, job_id, cb) {
    const url = `/assit/studentsJob?uid=${ uid }&job_id=${ job_id }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 管理员－查看作业所有作业
  adminStudentsJob: function(uid, student_id, cb) {
    const url = `/admin666/studentsJob?uid=${ uid }&student_id=${ student_id }`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  assitJobList: function(uid, cb) {
    const url = `/assit/jobList?uid=${ uid }`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 助教－批改作业
  correctJob: function(obj, cb) {
    const url = `/assit/correctJob`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  //创建作业并上传, 上传成功为未发布状态
  createJob: function(obj) {
    const url = `/admin666/createJob`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  upload: function(url, obj, cb) {
    $.ajax({
      url: url,
      type: 'POST',
      data: obj,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      processData: false,
      contentType: false,
      success: (result, textStatus, jqXHR) => {
        return cb(result);
      }
    });
  },

  // 发布 task
  publishJob: function(obj, cb) {
    const url = `/admin666/publishJob`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  publishAnswer: function(obj, cb) {
    const url = `/admin666/publishAnswer`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  answerList: function(uid, cb) {
    const url = `/admin666/answerList?uid=${ uid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  adminUserInfo: function(uid, cb) {
    const url = `/admin666/studentsInfo?uid=${ uid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  modifyStudentsInfo: function(obj, cb) {
    const url = `/admin666/modifyStudentsInfo`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  adminUserInfo: function(uid, cb) {
    const url = `/admin666/studentsInfo?uid=${ uid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 查看单个用户所有作业
  adminStudentsJob: function(uid, sid, cb) {
    const url = `/admin666/studentsJob?uid=${ uid }&student_id=${ sid }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  modifyPaidInfo: function(obj, cb) {
    const url = `/admin666/modifyPaidInfo`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },




























  getEvaluate: function (id,cb) {
    const url = '/job/getEvaluate';

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  getAnswer: function (id,cb) {
    const url = `/job/getAnswer`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  getAnswerList: function(cb) {
    const url = `/job/getAnswerList`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  }



}

module.exports = SpringModel;
