"use strict";

const Reflux = require('reflux');
const SublistActions = require('../actions/SublistActions');
// 存储所有的子帐户列表
var SublistStore = Reflux.createStore({
    userList:[],
    listenables:[SublistActions],
    onSetList:function(arr){
      this.userList = arr;
    },
    onGetList:function(){
      this.trigger(this.userList);
    }

});

module.exports = SublistStore;
