"use strict";
var Reflux = require('reflux');
var MergerResultActions = require('../actions/MergerResultActions');

var MergerResultStore = Reflux.createStore({
  listenables: [MergerResultActions],
  _data: {},
  onChangeData: function() {},
  onSetList: function(data) {
      this._data = data;
      this.trigger(data);
  },
  onGetData: function() {},
});

module.exports = MergerResultStore;
