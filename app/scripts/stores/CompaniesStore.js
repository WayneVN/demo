"use strict";
var Reflux = require('reflux');
var CompaniesActions = require('../actions/CompaniesActions');
var FilterModal = require('../model/filterModal');
var _ = require('_');

var CompaniesStore = Reflux.createStore({
  listenables:[CompaniesActions],
  info:null,
  onSetData:function(id){
    var self = this;
    FilterModal.getBackground(id,function(data){
      self.info = data;
      self.trigger(self.info);
    });
  },
  //只做缓存数据读取
  onGetData:function(id){
    if (this.info) {
      this.trigger(this.info);
    }else {
      CompaniesActions.setData(id);
    }
  },

});

module.exports = CompaniesStore;
