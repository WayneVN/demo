'use strict';
/**
 * 全局 Dialog 样式A 上传流水那样的样式
 * icon 显示图片
 * close  关闭触发的函数
 * @type {*|exports|module.exports}
 */
var React = require('react');
var DialogAction = require('../action/dialogAction');
var Dialog = require('./dialog');

var {
  PropTypes
} = React;

var DialogThemeA = React.createClass({
  //props值属性
  propTypes: {
    icon: PropTypes.string,
    title: PropTypes.string,
    close: PropTypes.func,
    clazz: PropTypes.string,
  },

  //默认props值
  getDefaultProps() {
    return ({
      icon: "/images/JOUDOU.COM.png", //logo
      title: "", //标题
      close: () => {}, //关闭触发的函数
    })
  },

  closeDialog() {
    this.refs.dialogThemeA.closeDialog();
  },

  render() {
    const {
      title,
      children,
      icon,
      clazz = ''
    } = this.props;

    return (

      <Dialog ref="dialogThemeA" close={this.props.close}
              dialogClassName={`custom-modal-lg panel-step-bg ${clazz}`}
      >
              <div className="bs-modal ">
                <div className="modal-container" >
                  <Dialog.Header>
                    <img src={icon} />
                    <a href="javascript:;" className="flr" onClick={this.closeDialog}>
                      <i className="fa fa-times"></i>
                    </a>
                    <div className="step-warp">
                    </div>
                  </Dialog.Header>



                  <div className="panel-step-center">
                    <div className="panel-head">
                      <span>{title}</span>
                    </div>


                    {children}
                  </div>

                </div>
              </div>
            </Dialog>

    )
  }
});

DialogThemeA.Body = React.createClass({

  render() {
    return (
      <div className="panel-body" {...this.props}>
             {this.props.children}
           </div>
    );
  }
});

DialogThemeA.Footer = React.createClass({

  render() {
    return (
      <div className="panel-footer" {...this.props}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = DialogThemeA;
