'use strict';
var React = require('react');

var Else = React.createClass({
  displayName:"Else",

  propTypes: {
    when: React.PropTypes.bool,
  },

  getDefaultProps() {
    return({
      when:true,
    });
  },

  render() {
    let {when,children} = this.props;

    return when ? <div time={new Date()}>{children}</div> : null;
  }

});

module.exports = Else;
