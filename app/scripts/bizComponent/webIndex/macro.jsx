'use strict';
/**
 * 每日贴士组件
 * @type {*|exports|module.exports}
 */
var React = require('react');
var Title = require('../../component/title');

var Macro = React.createClass({

  render() {
    return(
      <div>
        <Title title="宏观透视" subTitle="MACRO"/>
        <img src="../images/lock.png" className="mt10"/>
      </div>
    );
  }
});

module.exports = Macro;

