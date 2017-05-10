"use strict";
var Reflux = require('reflux');
var ScopeActions = require('../action/scopeAction');
import UserModel from '../model/userModel';

var ScopeStore = Reflux.createStore({
  listenables: [ScopeActions],
  onGetScope: function() {
    new UserModel().getScope(data => {
      if(data.status){
        this.trigger(data);
      }
    });
  },

});

module.exports = ScopeStore;
