'use strict';
/**
 * 添加自选股引导2
 * @type {*|exports|module.exports}
 */
var React = require('react');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var StockTeach1 = React.createClass({

  render() {
    return(
      <div className="dialogThemeC">
        <div className="bg"></div>
        <div className="content teach2">
          <div className="next">
            <a href="javascript:;" className="jd-btn jd-btn-orange flr " onClick={() => DialogAction.close()}>
              知道了
            </a>
          </div>
          <img src="../../images/teach/teach-2.png" />
        </div>
      </div>
    )
  }
});

module.exports = StockTeach1;


