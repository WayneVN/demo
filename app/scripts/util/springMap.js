/**
 * 春训营－公用映射字典
 * @author chenmin@joudou.com
 */
"use strict";

var SpringMap = {
  // 提交状态
  jobStatus: {
    0: '未提交',
    1: '正常提交',
    2: '晚交'
  },

  jobScoreLevel: {
    0: '未评价',
    1: '很水',
    2: '普通',
    3: '优秀'
  },

  itemMap : {
    0: "未审核",
    1: "普通",
    2: "付费",
  },

  pay : {
    0: '当期未付费',
    1: ' 当期已付费'
  },

}
module.exports = SpringMap;
