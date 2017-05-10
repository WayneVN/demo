"use strict";

var Reflux = require('reflux');
var InternalCheckActions = require('../actions/InternalCheckActions');
var InternalTabActions = require('../actions/InternalTabActions');

// 存储btn 选择条件和count
var InternalCheckStore = Reflux.createStore({
    listenables:[InternalCheckActions],
    data:{
      select:[],
      count:{}
    },
    onSet:function(data){
      this.data.count = data;
      this.trigger(data);
    },
    onGet:function(){
      this.trigger(this.data);
    },
    onSetSelect:function(params){
      var select = this.data.select;
      // var self = this;
      var isPush = true;
      // console.info('debug line 32',select);
      try {
        for (var i = 0; i < select.length ; i++) {
          if (select[i].key == params.key) {
            select[i] = params;
            isPush = false;
          }
        }
        if (isPush) {
          select.push(params);
        }
      } catch (e) {

      } finally {
          this.data.select = select;
      }
      var countClazz = 0;
      // for (var i = 0; i < select.length; i++) {
      //   if (select[i].val[0].clazz) {
      //     countClazz++;
      //   }
      // }
      // if (countClazz == 4) {
      //   InternalTabActions.initQuery();
      // } else {
      //   InternalTabActions.setSelect();
      // }
    },
    onGetSelect:function(){
      this.trigger(this.data);
    }
});

module.exports = InternalCheckStore;
