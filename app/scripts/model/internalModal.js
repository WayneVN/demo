/**
 * 内部交易相关请求
 */
 "use strict";
 const http = require('../util/http.js');

class InternalModal {
  onAutoGet(val,cb){
    let url =`/internal/querysearch?condition=${val}`;
    http.get(url,(err,data)=>{
      let relust = err? {} : http.searchFilter(data);
      return cb(relust);
    });
  }
  // 查询是否有内部交易
  getInternal(id,cb){
    let url = `/internal/stocks/${id}?page_size=1&page_num=1`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  initEvents(cb){
    let url = '/internal/events?after_date=20160101&page_size=15';
    http.get(url,(err,data)=>{
      return cb(data)
    });
  }
  getEvents(parmas,cb){
    let url = `/internal/events${parmas}&page_size=15&after_date=20160101`;
    http.get(url,(err,data)=>{
      return cb(data)
    });
  }
  getInitStockInfo(parmas,cb){
    let {stock_id,top} = parmas;
    let url = `/internal/stocks/${stock_id}?top=${top}`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  getStockInfo(url,cb){
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  getBaseInfo(event_id, cb){
    let url = `/internal/events/${event_id}/base_info`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  getCommitment(event_id,cb){
    let url = `/internal/events/${event_id}/commitment`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  getProcedure(event_id,cb){
    let url = `/internal/events/${event_id}/procedure`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  getNewStockInfo(stock_id, cb) {
    let url = `/internal/stocks/${stock_id}`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }
  baselastPrice(params, cb) {
    let url = `/stock-api/baselast-price?codes=${params}`;
    http.get(url,(err,data)=>{
      return cb(data);
    });
  }



}

export default new InternalModal();
