"use strict";
var Reflux = require('reflux');
var SimilarActions = require('../actions/SimilarActions');
var filterModal = require('../model/filterModal');
var time = require('../util/getTime');

var SimilarStore = Reflux.createStore({
  listenables:[SimilarActions],
  onGetData:function(id,qtypes,page_size){
    var params = {
      id:id,
      with_compared:1,
      beg:time.oneYear().beg,
      end:time.oneYear().end,
      qtypes:qtypes,
      page_num:1,
      page_size:page_size
    };
    var self = this;
    filterModal.getSimilar(params,function(data){
      self.trigger(data.data[qtypes]);
    });
  }
});

module.exports = SimilarStore;
