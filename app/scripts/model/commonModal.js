/**
 * 公用
 */

"use strict";
var http = require('../util/http.js');
var _ = require('_');

var CommonModal = {
  onAutoGet:function(val,cb){
     val = encodeURI(val);
    let url = `/stockinfogate/stock/namefinder?keyword=${ val }`;
    http.get(url,function(err,data){
      var list = [];
      if (data.status) {
        var len = data.data.length;
        for (var i = 0; i < len ; i++) {
          let str = `${ data.data[i].stockname } (${ data.data[i].stockid })`;
          list.push(str);
        }
      }
      return cb(list);
    });
  },

  getSearch:function(path,val,cb){
    let url =`/filter/search?k=${val}`;
    http.get(url,function(err,data){
      return cb(data);
    });
  },
};

module.exports = CommonModal;
