/**
 * Created by whc on 16/5/22.
 * 时间工具类
 */
//非交易日,除周六日,后期可以按年度添加规避特殊交易日
const nonTradingDay = {
  '2016':'0609,0610,0611,0915,0916,0917,1001,1002,1003,1004,1005,1006,1007',
};

/** *
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 *可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 *Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "日",
    "1" : "一",
    "2" : "二",
    "3" : "三",
    "4" : "四",
    "5" : "五",
    "6" : "六"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}



class DateUtil {
  constructor(date){
    this.now = date || new Date();
    this.RT_RANGES = [93000, 153300]; // 实时区间
    this.NORMAL_RANGES = [153000, 193000]; // 平时区间
  }

  _getTicker() {
    var n = this.now,
      m = n.getMinutes(),
      s = n.getSeconds();
    // h+mmss
    return [n.getHours(), m > 9 ? m : '0' + m, s > 9 ? s : '0' + s].join('') * 1;
  }

  // 是否为实时区间
  isInRtRanges() {
    var day = this.now.getDay(),
      isWeekend = (day === 6) || (day === 0); // 6 = Saturday, 0 = Sunday
    if (isWeekend) {
      return false;
    } else {
      var ticker = this._getTicker();
      return ticker >= this.RT_RANGES[0] && ticker <= this.RT_RANGES[1];
    }
  }


  // 是否为平时区间
  isInNormalRanges() {
    var ticker = this._getTicker();
    return ticker >= this.NORMAL_RANGES[0] && ticker <= this.NORMAL_RANGES[1];
  }

  /**
   * 当个交易日
   * @returns {Date|*}
   */
  getTDay() {
    var date = this._calTradingDay(0);

    return new DateUtil(date);
  }

  //当前日期date , go 下一天为1 ; 上一天为 -1 当天为0
  _calTradingDay(go) {
    var nowDate = new Date();
    nowDate.setDate(this.now.getDate()+go);

    while(!this.judgeTradingDay(nowDate)){
      go == 1 ? nowDate.setDate(nowDate.getDate()+1) :
        nowDate.setDate(nowDate.getDate() -1);
    }

    return nowDate;
  }

  //交易日
  judgeTradingDay(date){

    return nonTradingDay[date.getFullYear()].indexOf(date.Format('MMdd')) < 0 &&
      (date.getDay() !== 6) && (date.getDay() !== 0);
  }

  /**
   * 上一个交易日
   */
  getPrevTDay() {
    var date = this._calTradingDay(-1);

    return new DateUtil(date);
  }

  /**
   * 获取下一个交易日
   */
  getNextTDay() {
    var date = this._calTradingDay(1);

    return new DateUtil(date);
  }

  pattern(fmt) {
    return this.now.pattern(fmt);
  }

  Format(fmt) {
    return this.now.Format(fmt);
  }


}



module.exports = DateUtil;
