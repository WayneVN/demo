'use strict';
/**
 * 全局 Dialog 样式B 登录那样的样式
 * icon 显示图片
 * close  关闭触发的函数
 * @type {*|exports|module.exports}
 */
var React = require('react');
var DialogAction = require('../actions/dialogAction');
var Dialog = require('./dialog');


var {
  PropTypes
  } = React;

var DialogThemeB = React.createClass({
  //props值属性
  propTypes:{
    icon: PropTypes.string,
    title: PropTypes.string,
    close: PropTypes.func,
  },

  //默认props值
  getDefaultProps(){
    return({
      icon : "./images/JOUDOU.COM.png",//logo
      title : "",//标题
      close : () => {},//关闭触发的函数
    })
  },

  closeDialog(){
    this.refs.dialogThemeB.closeDialog();
  },

  render() {
    return(


      <Dialog ref="dialogThemeB" close={this.props.close}
              dialogClassName="dialogThemeB">

      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" onClick={() => this.closeDialog()}>
            <span>×</span><span className="sr-only">Close</span>
          </button>
          <h4 className="modal-title" ></h4>
        </div>
        {this.props.children}
      </div>


        </Dialog>

  );
  }
});

DialogThemeB.Body = React.createClass({

    render(){
      return(
        <div className="modal-body" {...this.props} >
          {this.props.children}
        </div>
      );
    }
});

DialogThemeB.Footer = React.createClass({

  render() {
    return (
      <div className="modal-footer" {...this.props}>
        {this.props.children}
      </div>
    );
  }
});


module.exports = DialogThemeB;

