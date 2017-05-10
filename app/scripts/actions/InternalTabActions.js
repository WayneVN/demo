var Reflux = require('reflux');

var InternalTabActions = Reflux.createActions([
  'queryAll',
  'initQuery',
  'setSelect',
  'setPageNum'
]);

module.exports = InternalTabActions;
