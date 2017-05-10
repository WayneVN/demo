var Reflux = require('reflux');
var DoumiEntryAction = require('../actions/doumiEntryAction');

var DoumiEntryStore = Reflux.createStore({
    listenables: [DoumiEntryAction],


    refresh: function() {
        this.trigger('refresh');
    },

});

module.exports = DoumiEntryStore;
