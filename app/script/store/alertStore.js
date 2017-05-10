"use strict";
var Reflux = require('reflux');
var AlertActions = require('../action/alertAction');

var AlertStore = Reflux.createStore({
  listenables: [AlertActions],
  onOpen: function(type, title, msg, format) {
    this.open(type, title, msg, format);
  },

  onSuccess: function(title, msg, format){
      this.open('success', title, msg, format);
  },

  onError: function(title, msg, format){
    this.open('error', title, msg, format);
  },

  onWarn: function(title, msg, format){
    this.open('warn', title, msg, format);
  },

  open: function(type, title, msg, format){
    format = format ? format : {
      timeOut: 5000,
      extendedTimeOut: 1000
    };

    this.trigger(type, title, msg, format);
  },

});

module.exports = AlertStore;
