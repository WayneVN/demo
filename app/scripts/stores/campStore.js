/**
 * 训练营大咖讲堂
 * Created by whc
 */
"use strict";
var Reflux = require('reflux');
var CampAction = require('../actions/campAction');
var CampModal = require('../model/campModal');

var CampStore = Reflux.createStore({
  listenables: [CampAction],

});

module.exports = CampStore;



