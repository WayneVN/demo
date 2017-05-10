"use strict";
var moment = require('moment');
var time = {
  // 获取今天到去年，365天的时间范围
  oneYear:function(){
    return {
      beg: moment().subtract(1,'years').format('YYYYMMDD'),
      end:moment().format('YYYYMMDD'),
    };
  },
  // 取所有历史纪录(15年)
  allYear:function(){
    return {
      beg: moment().subtract(15,'years').format('YYYYMMDD'),
      end:moment().format('YYYYMMDD'),
    };
  },
  getCurrTime:function(step){
    switch (parseInt(step)) {
      case 1:
        return moment().subtract(7,'days').format('YYYYMMDD');
        break;
      case 2:
        return moment().subtract(30,'days').format('YYYYMMDD');
        break;
      case 3:
        return moment().subtract(90,'days').format('YYYYMMDD');
        break;
      case 4:
        return moment().subtract(365,'days').format('YYYYMMDD');
        break;
    }
  }
};
module.exports  = time;
