/**
 * Created by whc on 16/6/17.
 * 页面枚举管理
 */

var PageEnum = {
  userAccount: { //个人中心
    ucInfo: 'ucInfo', //个人资料
    ucMdfPWD: 'ucMdfPWD', //密码修改
    integral: 'integral', //个人积分
    feedback: 'feedback', //意见反馈
    message: 'message', //站内信,
    setting: 'setting',
    doumi: 'doumi',
    lottery: 'lottery', // 我的奖品
  },

  FeedbackType: {
    '1': '数据不准确',
    '3': '网站bug',
    '4': '功能错误',
  }
}

module.exports = PageEnum;
