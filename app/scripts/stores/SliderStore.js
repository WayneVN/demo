"use strict";

const Reflux = require('reflux');
const SliderActions = require('../actions/SliderActions');
// const FilterModal = require('../model/filterModal');
import FilterModal from '../model/filterModal';
// 存储初始化条件
var SliderStore = Reflux.createStore({
    listenables:[SliderActions],
    initData:false,
    init:function(){
      this._init();
    },
    _init:function(){
      FilterModal.distribution(data=>{
        window._keyMap = data;
        this.initData = data;
      });
    },
    onGetInitRange:function(){
      this.trigger(this.initData);
    }
});

module.exports = SliderStore;
