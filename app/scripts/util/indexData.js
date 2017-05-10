/**
 * Created by whc on 16/4/7.
 */
/**
 * 指数管理
 */
class IndexData {
  constructor() {
    return {
      "000001.sh": {name: '上证', longName: '上证指数'},
      "399001.sz": {name: '深证', longName: '深证成指'},
      "399006.sz": {name: '创指', longName: '创业板指'},
      "399005.sz": {name: '中小', longName: '中小板指'},
      }
  }
}

module.exports = IndexData;
