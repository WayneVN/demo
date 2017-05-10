/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "春令营－接口－copy春训营的，就是多了前缀"
 */

"use strict";

const http = require('../util/http');
const $ = require('jquery');

var SummerModel = {

  // 学生查看自己上传的作业解答
  getmyAnswer: function(uid, job_id, cid, cb) {
    const url = `/camp/students/myAnswer?uid=${ uid }&job_id=${ job_id }&course_id=${cid}`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 获取当前用户信息
  studentsUserInfo: function (uid,cb) {
    const url = `/camp/students/userInfo?uid=${uid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 作业列表
  getJobList: function (uid, cid, cb) {
    const url = `/camp/students/jobList?uid=${uid}&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 查看批改结果
  jobComments: function (uid, jobid, cid, cb) {
    const url =  `/camp/students/jobComments?uid=${uid}&job_id=${jobid}&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  //  学生上传作业答案 Post
  jobUpload: function (obj,cb) {
    const url = '/camp/students/jobUpload';

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  // 获取作业列表－－任何权限都能看到
  jobQuestions: function (uid, cid, cb) {
    const url = `/camp/students/jobQuestionList?uid=${ uid }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 需要权限认证
  jobAnswers: function (uid, cid, cb) {
    const url = `/camp/students/jobAnswers?uid=${ uid }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 报名
  userRegister: function (obj, cb) {
    const url = `/camp/students/userRegisterByOrder`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  //  助教－查看所有用户作业
  assitStudentsJob: function(uid, job_id, cid,cb) {
    const url = `/camp/assit/studentsJob?uid=${ uid }&job_id=${ job_id }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 管理员－查看作业所有作业
  adminStudentsJob: function(uid, student_id, cid, cb) {
    const url = `/camp/admin/studentsJob?uid=${ uid }&student_id=${ student_id }&course_id=${cid}`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  assitJobList: function(uid, cid, cb) {
    const url = `/camp/assit/jobList?uid=${ uid }&course_id=${cid}`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  // 助教－批改作业
  correctJob: function(obj, cb) {
    const url = `/camp/assit/correctJob`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  //创建作业并上传, 上传成功为未发布状态
  createJob: function(obj) {
    const url = `/camp/admin/createJob`;

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
    const url = `/camp/admin/publishJob`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  publishAnswer: function(obj, cb) {
    const url = `/camp/admin/publishAnswer`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  answerList: function(uid, cid,cb) {
    const url = `/camp/admin/answerList?uid=${ uid }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  adminUserInfo: function(uid, cid, cb) {
    const url = `/camp/admin/studentsInfo?uid=${ uid }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  modifyStudentsInfo: function(obj, cb) {
    const url = `/camp/admin/modifyStudentsInfo`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },


  // 查看单个用户所有作业
  adminStudentsJob: function(uid, sid, cid, cb) {
    const url = `/camp/admin/studentsJob?uid=${ uid }&student_id=${ sid }&course_id=${cid}`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  modifyPaidInfo: function(obj, cb) {
    const url = `/camp/admin/modifyPaidInfo`;

    http.post(url,obj, (err,data) => {
      return cb(data);
    });
  },

  getEvaluate: function (id,cb) {
    const url = '/camp/job/getEvaluate';

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  getAnswer: function (id,cb) {
    const url = `/camp/job/getAnswer`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  getAnswerList: function(cb) {
    const url = `/camp/job/getAnswerList`;

    http.get(url, (err,data) => {
      return cb(data);
    });n
  },

  // 批量下载用户的作业
  getDownloadJobs: function(params, cb) {
    const url = `/camp/assit/downloadJobs?uid=${ params.uid }&job_id=${ params.job_id }&class_id=${ params.class_id == 99? '':params.class_id }&is_ontime=${ params.is_ontime == 99?'': params.is_ontime }&score_level=${ params.score_level==99?'':params.score_level }&course_id=${ params.course_id }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },


  // 批量下载用户的批改结果信息
  getDownloadCorrectInfo: function(params, cb) {
    const url = `/camp/assit/downloadCorrectInfo?uid=${ params.uid }&job_id=${ params.job_id }&class_id=${ params.class_id==99?'':params.class_id }&is_ontime=${ params.is_ontime==99?'':params.is_ontime }&score_level=${ params.score_level==99?'':params.score_level }&course_id=${ params.course_id }`;

    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  getUserInfo: function(uid, cb) {
    const url = `/camp/students/userInfo?uid=${ uid }`;
    http.get(url, (err,data) => {
      return cb(data);
    });
  },

  unLock: function(obj, cb) {
    const url = '/camp/students/unlock';
    http.post(url, obj, (err,data) => {
      return cb(data);
    });
  },

  upgrade: function(obj, cb) {
    const url = '/camp/students/upgrade';
    http.post(url, obj, (err,data) => {
      return cb(data);
    });
  }

}

module.exports = SummerModel;
