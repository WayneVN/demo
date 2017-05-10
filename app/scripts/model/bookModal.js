/**
 * Created by whc on 16/4/7.
 */

/**
 * 账簿相关接口
 */
var TallyModal = require('./tallyModal').default;
var Storage = require('../util/storage').default;
var RECORD_STATUS = require('../util/statusConfig');
var Format = require('../util/format');
var moment = require('moment');
var  _ = require('_');
var _storage = new Storage();


var BookModal = (function(){
  //内部共用data,可减少发送请求
  var data = {
    book : {},
    bookList : null,
  };

  //提供公共方法
  var getSubId, getDefaultSubId,setSubId, getBookList, getBook, currentPositions, getRecordInfo, createBook,deleteBook,
    _setDayValue;

  //获取subId
  getSubId = function(callback){
    let sub_id = _storage.getStore('sub_id');
    if(sub_id){
        callback(sub_id);
    }else{
      getDefaultSubId(callback);
    }

  }

  //当sub_id为空时清除数据
  setSubId = function(sub_id){

    //clear Data
    data.bookList = null;
    data.book = {};

    if(sub_id){
      _storage.setStore('sub_id',sub_id);
    }else{
      _storage.removeStore('sub_id');
    }
  }

  getDefaultSubId = function(callback) {
      getBookList((bookList) =>{
        if(bookList.length == 0){
          callback(null);
          return;
        }
        let sub_id = bookList[0].id;
        _storage.setStore('sub_id',sub_id);
        callback(sub_id);
      })
  }

  //获取账簿
  getBookList = function(callback){
    if(data.bookList){
      callback(data.bookList);
      return;
    }
    TallyModal.userList(result=>{
      if (result && result.sub_accounts.length!=0) {
          data.bookList = result.sub_accounts;
          callback(result.sub_accounts);
      }else{
        data.bookList = []
        callback(data.bookList);
      }
    });
  }

  //获取账簿信息
  getBook = function(sub_id,callback) {
    let bookList = data.bookList;

    if(!bookList){
      this.getBookList(() => this.getBook(sub_id, callback));
    }else{
      _.forEach(bookList, function (item, k) {
        if (item.id == sub_id) {
          data.book = item;
          callback(item);
        }
      });

    }


  }

  // 获取当前帐户信息，如状态，券商，该接口无文档
  getRecordInfo = function(sub_id, callback) {
    let url = `/tally-api/record-info?sub_id=${sub_id}`;
    TallyModal.get(url,data=>{
      let status = RECORD_STATUS[data.record.status||12];
      data.status = status;

      _setDayValue(data);

      callback(data);
    });
  }


  //日期转化
  _setDayValue = function(data) {
    data.record = data.record || {};
    var begin = +moment(Format.stringDateFormat(data.record.record_first_day)).toDate();
    var end = +moment(Format.stringDateFormat(data.record.record_last_day)).toDate();
    var lastUpdateDay = +moment(Format.stringDateFormat(data.record.last_update_date)).toDate();
    var now = +new Date();
    var day = 24 * 60 * 60 * 1000;

    data.record.not_update_day = Math.floor((now - end) / day);

    if (data.record.not_update_day >= 7) {
      data.record.show_delta_day = true;
    }

    var width = (Math.max(end - begin, 1)) / (now - begin);
    data.record.bar_width =  Math.min(width, 1) * 100 + '%';
  }

  createBook = function(bookName, brokerId, terminal, outputName, fileType, callback) {
    //创建账簿
    TallyModal.userCreate({
      name:bookName,
      terminal_id:terminal.id,
      broker_id:brokerId,
      outputname:outputName,
      file_type:fileType
      }, (result) => {
        if (result.status) {
            let sub_id = result.data.sub_id;
            this.setSubId(sub_id);
        }
        callback(result);
    });

  }


  deleteBook = function(sub_id, callback) {
    let url = '/sub-account/delete';
    let obj = {
      sub_id:sub_id,
    };

    TallyModal.post(url, obj, data => {
      if(data.status){
       this.setSubId()
      }
      callback(data);
    });
  }


  return{
    getSubId:getSubId,
    setSubId:setSubId,
    getBookList:getBookList,
    getBook:getBook,
    currentPositions:currentPositions,
    getRecordInfo:getRecordInfo,
    createBook:createBook,
    deleteBook: deleteBook,
  }
})();


module.exports = BookModal;
