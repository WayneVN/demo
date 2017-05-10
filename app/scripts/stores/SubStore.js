/**
 * subStore
 */
"use strict";
const Reflux = require('reflux');
const SubActions = require('../actions/SubActions');
const RecordStatusActions = require('../actions/RecordStatusActions');
import Storage from '../util/storage';
import TallyModal from '../model/tallyModal';


var BookModal = require('../model/bookModal');

// 存储每次改变后的subid
var SubStore = Reflux.createStore({
  id: window._subId,
  type: 'sub',
  listenables: [SubActions],

  onSetSub: function(sub_id) {
    window._subId = sub_id;
    this.id = sub_id;
    this.type = 'sub';
    this.getStatus(sub_id, this.type);
    this.trigger({
      id: this.id,
      type: this.type
    });
  },
  onSetVir: function(vir_id) {
    this.id = vir_id;
    this.type = 'vir';
    this.getStatus(vir_id, this.type);
    this.trigger({
      id: this.id,
      type: this.type
    });
  },
  onGetPath: function() {
    if(this.id){
      this.getStatus(this.id, this.type);
      this.trigger({
        id: this.id,
        type: this.type
      });
    }

  },
  onInitStatus: function() {
    let _storage = new Storage();
    let paramsUrl = _storage.getStore('paramsUrl');
    if (paramsUrl.length > 0) {
      let url = `/record/status?t=${new Date().getTime()}&${paramsUrl}`;
      TallyModal.get(url, (data) => {
        _storage.setStore('recordStatus', data);
        _storage.setStore('paramsUrl', paramsUrl);
        let type = _storage.getStore('tabActive') || 1;
        let typeId = type == 1 ? 'sub_id' : 'virtual_id';
        RecordStatusActions.change(data, typeId);
      });
    }
  },
  getStatus: function(id, type) {
    let _storage = new Storage();
    let typeId = type == 'sub' ? 'sub_id' : 'virtual_id';
    let paramsUrl = `${typeId}=${id}`;
    let url = `/record/status?t=${new Date().getTime()}&${paramsUrl}`;
    TallyModal.get(url, (data) => {
      _storage.setStore('recordStatus', data);
      _storage.setStore('paramsUrl', paramsUrl);
      RecordStatusActions.change(data, typeId);
    });
  },


  ///whc
  //获取subId 如果以后组合也用建议拆分方法
  onGetSubId: function() {
    BookModal.getSubId((sub_id) => {
      if(sub_id){
        this.trigger({
          id : sub_id,
        });
      }
    });

  },


  onSetSubId: function(sub_id){
    BookModal.setSubId(sub_id);
    this.trigger({
      id : sub_id,
    });
  },


});

module.exports = SubStore;
