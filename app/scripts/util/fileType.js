/**
 * Created by whc on 16/4/6.
 */
/**
 * 导出类型
 */
class FileType {
  constructor() {
    return {
      "1": "交割单",
      "2": "资金流水",
      "3": "资金明细",
      "4": "对账单",
      "9": "其他",
    }
  }
}

module.exports = new FileType();
