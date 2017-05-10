var http = require('../util/http');
var moment = require('moment');
var Calculation = require('../util/calculation');
import $ from 'jquery';

class TallyModal  {
  get(url,cb) {
    http.get(url, (err,data) =>{
      cb(data);
    });
  }
  post(url,obj,cb) {
    http.post(url,obj, (err,data) =>cb(data));
  }

  realPrice(params,cb) {
    let url = '/stock-api/real-time-price';
    http.post(url,params, (err,data) => {
      if (data) {
        cb(data);
      }
    });
  }

  //上传文件
  postFile(data, callback){

    $.ajax({
      url: `/record/upload`,
      type: 'POST',
      data: data,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      processData: false,
      contentType: false,
      success :(data, textStatus, jqXHR)=>callback(null,data, textStatus, jqXHR),
      error:(jqXHR, textStatus, errorThrown)=>callback(errorThrown,{}, textStatus, jqXHR)
    });
  }

  //每日盈亏
  /**
   *
   * @param sub_id
   * @param type 年月日周
   * @param beg  开始时间
   * @param end  结束时间
     * @param callback
     */
  getUserTotalIncome(type, beg, end, callback) {
    let str ='';

    switch (type) {
      case 'day':
        beg = moment().subtract(20,'years').format('YYYYMMDD');
        str = `days?start=${beg}&end=${end}`;
        break;
      default:
        str = `slot?dayType=${type}`;
        break;
    }
    let uri = `/tally-api/user-total-income-${str}`;
    this.get(uri, callback);
  }


  // 买卖受益接口
  getRatio(sub_id, order, page, callback) {
    let url = `/tally-api/user-income-ratio-pages?sub_id=${sub_id}&p=${page}&ps=50&sortBy=earn_ratio&orderBy=${order}`;
    this.get(url,callback);
  }

  //个股盈亏
  getSums(sub_id, callback){
    let url = `/tally-api/user-income-sums?sub_id=${sub_id}`;
    this.get(url, callback);
  }

  //资产曲线1
  getUserAccountValueAll(callback){
    let url = `/tally-api/user-account-value-all`;
    this.get(url, callback);
  }

  //资产曲线2
  getUserInvestments(callback){
    let url = `/tally-api/user-investments?&all=1`;
    this.get(url, callback)
  }

  /**
   * 实时指数
   */
  getIndex(callback){
    const url = `/stockinfogate/indexqt/realtimeinfo?indexids=000001.SH,399001.SZ,399005.SZ,399006.SZ`;
    http.get(url, function(error, result ) {
      if (error || !result.data.length) {
        return callback({});
      }
      return callback(Calculation.indexData(result));
    });

  }


  //代码里应用到,但好像没用
  sumsParams(uri,cb){
    let url = `/tally-api/user-income-sums${uri}`;
    http.get(url, (err,data) =>cb(data));
  }

}
export default new TallyModal();
