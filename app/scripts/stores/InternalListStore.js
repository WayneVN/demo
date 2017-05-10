"use strict";
const Reflux = require('reflux');
const InternalListActons = require('../actions/InternalListActions');
import InternalModal from '../model/internalModal';
// 存储所有btn 选项，同时触发搜索结果
var InternalListStore = Reflux.createStore({
  listenables: [InternalListActons],
  _data: null,
  parmas: {},
  page: 1,
  select: [],
  uri:'',
  onSetData: function(params) {

  },
  onInit: function(stock_id, top) {
    // 重置排序条件
    this.select = [];
    this.uri = '';
    InternalModal.getInitStockInfo({
      stock_id: stock_id,
      top: top
    }, data => {
      for (var i = 0; i < data.events.length; i++) {
        data.events[i].stock_price = parseInt(data.events[i].stock_price) ==0?'-':data.events[i].stock_price;
        data.events[i].money = parseInt(data.events[i].money) ==0?'-':data.events[i].money;
        data.events[i].people_num = parseInt(data.events[i].people_num) ==0?'-':data.events[i].people_num;
      }
      this._data = data;
      this.trigger(this._data);
    });
  },
  onGetData: function(eid, sid) {
    let url = `/internal/stocks/${sid}?top=${eid}&${this.uri}`;
    InternalModal.getStockInfo(url,data=>{
      this._data = data;
      this.trigger(this._data);
    });
  },
  onSetPageNum: function(num) {
    this.page = num;
  },
  onSetSortKey: function(key, order) {
    let is = true;
    for (let i = 0; i < this.select.length; i++) {
      if (this.select[i].key == key) {
        this.select[i] = {
          key: key,
          val: order
        };
        is = false;
      }
    }
    if (this.select.length == 0 || is) {
      this.select.push({
        key: key,
        val: order
      });
    }
    let url = ``;
    // "event_type": "2", //交易类型
    //       "stock_price": "7.63", //成本
    //       "money": "20000000", //金额
    //       "share_ratio": "0.002", //占股比
    //       "people_num": "1", //人数
    //       "publish_date": "20150801" //时间
    for (let i = 0; i < this.select.length; i++) {
      switch (this.select[i].key) {
        case 1:
          url += `stock_price=${this.select[i].val}&`;
          break;
        case 2:
          url += `money=${this.select[i].val}&`;
          break;
        case 3:
          url += `share_ratio=${this.select[i].val}&`;
          break;
        case 4:
          url += `people_num=${this.select[i].val}&`;
          break;
        case 5:
          url += `pulibsh_date=${this.select[i].val}&`;
          break;
      }
    }
    this.uri = url;
  }
});

module.exports = InternalListStore;
