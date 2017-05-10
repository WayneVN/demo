// "use strict";
var Reflux = require('reflux');
var FilterActions = require('../actions/FilterActions.js');
var FilterModal = require('../model/filterModal.js');
var _ = require('_');
var FilterResultAction  = require('../actions/FilterResultAction');
var MergerSelectActions = require('../actions/MergerSelectActions');
/**
 * 个股筛选－筛选面板stores
 * 所有参数全部存入_select,每次操作同步_select对象
 *  方便别的地方读取
 */

var FilterStore = Reflux.createStore({
  listenables:[FilterActions],
  _data:{},
  _select:{},//缓存当前选择条件
  _sortObj:null,//缓存当前排序
  _page:{pageNum:1},
  onGetAll:function(){
    this.trigger(this._data);
  },
  onClearData:function(){
    this._data = {};
    this._select={};
  },
  onGetAllInit:function(){
    if (_.isEmpty(this._data)) {
        FilterActions.initRange();
    } else {
      this._data.init = true;
      this.trigger(this._data);
    }
  },
  // 初始化拖动条范围
  onInitRange:function(){
    FilterModal.conditionsearch({},data=>{
      data.init = true;
      data.initMinMax = data.conditions;
      data._select = this._select;
      this._data = data;

      // 保存初始化范围数据
      // MergerSelectActions.setAll(data.conditions[0].range);

      this.trigger(this._data);

      // 缓存筛选结果
      FilterResultAction.setData(data);
    });
  },
  // 滚动条改变后请求，参数从缓存（_select）中取
  onSetSelect:function(obj){
    this._select[obj.key] = obj;
    FilterModal.conditionsearch(this._select,data=>{
      data.initMinMax = this._data.initMinMax;
      data._select = this._select;
      this._data = data;
      this.trigger(this._data);
      // 触发筛选结果的action
      FilterResultAction.setData(data);
    });

  },
  onSelectSearch:function(obj){
    let _obj ={};
    _obj[obj.key] = obj;
    FilterModal.conditionsearch(_obj,data=>{
      data.initMinMax = this._data.initMinMax;
      this._data = data;
      this.trigger(this._data);
      // 触发筛选结果的action
      FilterResultAction.setData(data);
    });
  },
  onGetSelect:function(){
    this.trigger(this._select);
  },
  // 排序方式改变
  onSortKey:function(){
    var _this = this;
    FilterModal.conditionsearchSort(this._select,this._sortObj,this._page,function(data){
      _this._data = data;
      _this.trigger(_this._data);
      FilterResultAction.setData(data);
    });
  },
  onSetSortKey:function(obj){
    this._sortObj = {key:obj.key,order:obj.order};
  },
  onSetPageNum:function(current){
    this._page = {pageNum:current};
  },
  // 从缓存中删除某个属性
  onRemoveSelect:function(key){
    this._select = _.omit(this._select,key);
  }
});

module.exports = FilterStore;
