/**
 * Created by whc on 16/4/7.
 */

var StringUtil = {
  /**
   * 字符串长度 中文算两个字符
   * @param str
   * @returns {*}
     */
    countWord:function(str){
      return str.replace(/[^\x00-\xff]/g,"ww").length
    }
}

module.exports = StringUtil;
