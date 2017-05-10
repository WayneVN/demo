"use strict";
/**
 * 引导
 * Created by whc on 16/6/1.
 */

const Reflux = require('reflux');
const TeachActions = require('../action/teachAction');
const DialogAction = require('../action/dialogAction');

var TeachStore = Reflux.createStore({
  listenables: [TeachActions],

  onOpen(teachStep) {
    DialogAction.open(teachStep);
    this.trigger(teachStep);
  }

});

module.exports = TeachStore;
