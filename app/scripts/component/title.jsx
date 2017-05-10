'use strict';
/**
 * 首页样式的标题
 * @type {*|exports|module.exports}
 */
var React = require('react');

var Title = React.createClass({
  displayName:"Title",

  //props值属性
  propTypes:{
    title: React.PropTypes.string,
    subTitle: React.PropTypes.string,
  },


  render() {

    return(
    <div className="web-title">
      <span className="title">{this.props.title}</span>
      <span className="subTitle">{this.props.subTitle}</span>
        {this.props.children}
      </div>
    );

  }
});

var Right = React.createClass({
  render(){
    let {className} = this.props;
    var clazz = className? 'flr '+ className : 'flr';

    return(
      <div className={clazz}>
        {this.props.children}
      </div>
    )
  }
});


Title.Right = Right;


module.exports = Title;
