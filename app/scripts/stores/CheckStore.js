"use strict";
var Reflux = require('reflux');
var CheckActions = require('../actions/CheckActions');
import MergerModal from '../model/mergerModal.js';
var MergerResultActions = require('../actions/MergerResultActions');
const Modal = new MergerModal();

// 存储所有btn 选项，同时触发搜索结果
var CheckStore = Reflux.createStore({
  listenables: [CheckActions],
  mergerCheck: null,//存储
  interCheck:null,
  onSetData: function(params) {
    this.mergerCheck = params;
    this.trigger(this.mergerCheck);
  },
  onGetData: function() {
    if (this.mergerCheck) {
      this.trigger(this.mergerCheck);
    } else {
      Modal.initConditionsearch(data=>{
        this._data = data;
        this.trigger(data);
        MergerResultActions.setList(data);
      });
    }
  },
  onGetInterCheck:function(){

  },
  onSetInterCheck:function(params){
    // this.interCheck = params;
    // this.trigger(this.interCheck);
  }

});

module.exports = CheckStore;
