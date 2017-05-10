var Reflux = require('reflux');
var HeadAction = require('../action/headAction');

var HeadStore = Reflux.createStore({
    listenables: [HeadAction],

    onOpenUserCenter: function(page) {
        this.trigger('page', page);
    },

    onSetPosition: function (position) {
        this.trigger('position', position);
    }
});

module.exports = HeadStore;
