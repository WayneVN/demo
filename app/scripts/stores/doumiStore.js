var Reflux = require('reflux');
var DoumiAction = require('../actions/doumiAction');

var DoumiStore = Reflux.createStore({
    listenables: [DoumiAction],

    onOpen: function(stateData) {
        this.trigger('open', stateData);
    },

    onClose: function() {

        this.trigger('close');
    },

});

module.exports = DoumiStore;
