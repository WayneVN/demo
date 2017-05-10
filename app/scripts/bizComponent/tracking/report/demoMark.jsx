/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "页面'示例'遮罩层 "
 */

const React = require('react');

const GuideMark = React.createClass({

  close() {
    this.props.close();
  },

  render() {
    return (
      <div className="demomark-warp">
          <img src="../../../../images/mark-demo.png" className="demomark"/>
      </div>
    )
  }
});

module.exports = GuideMark;
