/**
 * Created by whc on 16/4/4.
 */
"use strict";
var Reflux = require('reflux');

var FileUploadAction = Reflux.createActions([
  'postFile',
  'getProgress',
]);


module.exports = FileUploadAction;
