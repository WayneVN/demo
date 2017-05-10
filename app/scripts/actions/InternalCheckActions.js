var Reflux = require('reflux');

var InternalCheckActions = Reflux.createActions([
  'set',
  'get',
  'setSelect',
  'getSelect'
]);

module.exports = InternalCheckActions;
