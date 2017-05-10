/**
 * Created by whc on 16/4/22.
 */
"use strict";
/**
 * 全局 Dialog打开管理 store
 * @type {Reflux|exports|module.exports}
 */
var Reflux = require('reflux');
var DialogAction = require('../action/dialogAction');

var DialogStore = Reflux.createStore({
  listenables: [DialogAction],

  onOpen: function() {
    this.currentDialog = arguments[0];
    this.trigger(arguments);
  },

  onClose: function(closeDialog) {
    let close = !closeDialog || closeDialog == this.currentDialog;

    if(close){
        this.trigger([DialogAction.Dialog.Close]);
    }

  },

});

module.exports = DialogStore;
