"use strict";
const Reflux = require('reflux');
const ReportActions = require('../actions/ReportActions');

var ReportStore = Reflux.createStore({
  listenables: [ReportActions],
  onOpen:function() {
    this.trigger('Report');
  }
});

module.exports = ReportStore;
