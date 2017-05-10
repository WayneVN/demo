"use strict";
var Reflux = require('reflux');
var RecordStatusActions = require('../actions/RecordStatusActions');
import Storage from '../util/storage';

var RecordStatusStore = Reflux.createStore({
  listenables: [RecordStatusActions],
  onChange: function(obj, type) {
    if (type != 'sub_id') {
      obj.data.title_lack = [];
      new Storage().setStore('recordStatus', obj);
    }
    this.trigger(obj);
  },
  onGetStatus: function() {
    var obj = new Storage().getStore('recordStatus') || {};
    this.trigger(obj);
  }
});

module.exports = RecordStatusStore;
