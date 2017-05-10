/**
 * Created by whc on 16/4/22.
 */
"use strict";
/**
 * 全局dialog管理
 * @type {Reflux|exports|module.exports}
 */
var Reflux = require('reflux');

var DialogAction = Reflux.createActions([
  'open',
  'close',

]);

/**
 * 在DialogAction.open() 调用,
 * dialog名称管理,方便管理查看有几个dialog和统一调用
 * @type {{}}
 */
DialogAction.Dialog = {
  Close: 'Close', // 关闭dialog
  Report: 'Report', // 投资报告
  RegEmailForm: 'RegEmailForm', // 邮件注册
  Login: 'Login', // 登录
  WechatLogin: 'WechatLogin', // 微信登录
  Message: 'Message', //
  Feedback: 'Feedback', // 意见反馈
  RegTelForm: 'RegTelForm', // 手机注册
  Success: 'Success', // 注册成功
  UserCenter: 'UserCenter', // 用户中心
  Activeation: 'Activeation', //
  UploadBill: 'UploadBill', // 上传交易记录
  Step1: 'Step1', // 创建账簿
  HowStep1: 'HowStep1', // 如何上传第一步
  HowStep2: 'HowStep2', // 如何上传第二步
  HowStep3: 'HowStep3', // 如何上传第三步
  UploadError: 'UploadError', // 上传失败
  FileProgress: 'FileProgress', // 文件上传进度
  VirtualDialog: 'VirtualDialog',//组合提示
  EnrolmentDialog: 'EnrolmentDialog',//训练营报名Dialog
  StockTagDialog: 'StockTagDialog',//股票标签管理
  StockTeach1: 'StockTeach1',// 自选股引导1
  StockTeach2: 'StockTeach2',// 自选股引导2
  StockDialog: 'StockDialg',  // 个股k线图弹窗
  Enrol: 'Enrol',  // 训练营报名付费窗口
  EnrolBind: 'EnrolBind' // 训练营绑定用户
}

module.exports = DialogAction;
