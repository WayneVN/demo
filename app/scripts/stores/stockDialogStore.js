var Reflux = require('reflux');
var stockDialogAction = require('../actions/stockDialogAction');

var stockDailogStore = Reflux.createStore({
    listenables: [stockDialogAction],

    onShowLine: function (type) {
      this.trigger({
        type: type
      });
    }
});

module.exports = stockDailogStore;
