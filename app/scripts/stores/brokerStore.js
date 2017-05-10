/**
 * Created by whc on 16/4/7.
 */
/**
 * 券商数据相关
 */
"use strict";
var Reflux = require('reflux'),
    BrokerAction = require('../actions/BrokerAction');


var BrokerStore = Reflux.createStore({
  listenables:[BrokerAction],
});

module.exports = BrokerStore;
