"use strict";
const Reflux = require('reflux');
const ReloadActions = require('../action/reloadAction');



const ReloadStore = Reflux.createStore({
  listenables: [ReloadActions],

  init: function() {

  },

  onReload: function() {
    this.trigger(true);
  },

  onLoad: function() {
    this.trigger(false);
  },
});

module.exports = ReloadStore;
