"use strict";
var Reflux = require('reflux');
var ScopeActions = require('../actions/scopeActions');
import MergerModal from '../model/mergerModal';

var ScopeStore = Reflux.createStore({
  listenables: [ScopeActions],
  onGetScope: function() {
    new MergerModal().getScope(data => {
      if(data.status){
        this.trigger(data);
      }
    });
  },

});

module.exports = ScopeStore;
