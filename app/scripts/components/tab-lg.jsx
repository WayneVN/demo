"use strict";
const React = require('react');
const {Link} = require('react-router');


var Tablg = React.createClass({
  render: function() {
    return (
      <div className="panel-tab">
        <ul className="tab-list">
          <Link to={'/msg/merger'} activeClassName="active">
            <li className="tab-item "  >
              <p className="tab-name"><i className="fa fa-pie-chart"></i>并购重组</p>
            </li>
          </Link>
          <Link to={'/msg/internal'}  activeClassName="active">
            <li className="tab-item "  >
              <p className="tab-name"><i className="fa fa-retweet"></i>内部交易</p>
            </li>
          </Link>

          <Link to={'/msg/DA'}  activeClassName="active">
            <li className="tab-item "  >
              <p className="tab-name"><i className="fa fa-arrows"></i>定向增发</p>
            </li>
          </Link>
        </ul>
      </div>
    );
  }
});

module.exports = Tablg;
