/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "引导图片"
 */

const React = require('react');

const GuideMark = React.createClass({

  close() {
    this.props.close();
  },

  render() {
    return (
      <div className="guidemark-warp">
        <div className="modal-backdrop fade in"
             style={{
               zIndex: 100
             }}
        >
        </div>
        <div className="guidemark">
          <img src="../../../../images/upload_mark.png" className="guidemark"/>
          <img
              src="../../../../images/closemark.png"
              className="closemark"
              onClick={this.close}
          />
        </div>
      </div>
    )
  }
});

module.exports = GuideMark;
