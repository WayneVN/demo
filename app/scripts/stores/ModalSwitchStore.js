var Reflux = require('reflux');
var ModalSwitchActions = require('../actions/ModalSwitchActions');

var ModalSwitchStore = Reflux.createStore({
  listenables:[ModalSwitchActions],
  onOpenModal:function(){
    this.trigger('open');
  },
});

module.exports = ModalSwitchStore;
