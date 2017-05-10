'use strict';
/**
 * 添加自选股引导1
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

        <div className="content teach1">
          <div className="next">
            <a href="javascript:;" className="jd-btn jd-btn-orange flr " onClick={() => DialogAction.open(Dialog.StockTeach2)}>
              下一步
            </a>
          </div>
          <img className="img-arrow" src="../../images/teach/teach-1-arrow.png" />
          <img className="img" src="../../images/teach/teach-1.png" />
        </div>

        </div>
    )
  }
});

module.exports = StockTeach1;
