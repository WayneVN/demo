"use strict";
var Reflux = require('reflux');
var OpenModalActions = require('../actions/OpenModalActions');
var _ = require('_');

var OpenModalStore = Reflux.createStore({
  listenables: [OpenModalActions],
  params:'',
  onOpen:function(params){
    this.params = params;
    this.trigger(this.params);
  }

});

module.exports = OpenModalStore;
