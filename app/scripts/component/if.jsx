'use strict';
var React = require('react');

var If = React.createClass({
  displayName:"If",

  getInitialState(){
    var ifElemnt = [];
    var elseElemnt = [];

    /*
    React.Children.forEach(this.props.children, function(e){

      if(e.type.displayName == "Else")
        elseElemnt.push(e);
      else
        ifElemnt.push(e);
    });
     */
    return({
      ifElemnt: ifElemnt,
      elseElemnt: elseElemnt,
    });

  },

  render() {
    var {ifElemnt,elseElemnt} = this.state;
    return this.props.when ? this.props.children : <noscript />;
    //return this.props.when ? <div time={new Date()}>{ifElemnt}</div>
    // : <div time={new Date()}>{elseElemnt}</div>
  }
});

module.exports = If;
