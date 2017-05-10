"use strict";
var Reflux = require('reflux');
var InternalActions = require('../actions/InternalActions');
var InternalModal = require('../model/internalModal.js');
var CheckActions = require('../actions/CheckActions');
import MergerModal from '../model/mergerModal';
const Modal = new MergerModal();
var MergerResultActions = require('../actions/MergerResultActions');
var _ = require('_');
var CheckActions = require('../actions/CheckActions');

var InternalStore = Reflux.createStore({
  listenables:[InternalActions],
  _data:{},
  _list:{},
  _select:{},//缓存当前选择条件
  _slider:[],
  _check:[],
  _page:{pageNum:1},
  onInitInternalRange:function(){
    var self = this;
    Modal.initConditionsearch(function(data){
      data.init=true;
      self._data = data;
      self._data.minMax = data.range_conditions;
      CheckActions.setData(data);
      MergerResultActions.setList(data);
      self.trigger(self._data);
    });
  },
  onGetAll:function(){
    if (!_.isEmpty(this._data)) {
      this.trigger(this._data);
    } else {
      InternalActions.initInternalRange();
    }
  },
  onSetSelect:function(slider,check){
    this._slider = slider;
    this._check = check;
    Modal.conditionsearch(slider,check,1,data=>{
      data.minMax = this._data.minMax;
      this._data = data;
      this._data._select = slider;
      CheckActions.setData(data);
      MergerResultActions.setList(data);
      this.trigger(this._data);
    });
  },
  onChangeSelect:function(slider,check){
    this._check = check;
    Modal.conditionsearch(slider,check,1,data=>{
      this._data = data;
      this._data._select = slider;
      CheckActions.setData(data);
      MergerResultActions.setList(data);
      this.trigger(this._data);
    });
  },
  // 读取缓存中的筛选条件，拿来分页
  onPage:function(current){
    var self = this;
    this._page = {pageNum:current};
    Modal.conditionsearch(this._slider,this._check,current,function(data){
      self._data = data;
      self.trigger(data);
      CheckActions.setData(data);
      MergerResultActions.setList(data);
    });

  },
  onRemoveEvent:function(name){
    this._list = _.omit(this._list,name);
  },
  onSetEvent:function(obj,name){
    var _this = this;
    var list = [];
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].clazz) {
        i-1>=0 ? list.push(i-1) : list =[];
      }
    }
    this._list[name] = list;
  }

});

module.exports = InternalStore;
