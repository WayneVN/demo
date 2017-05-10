'use strict';
var React = require('react');
var {Modal} = require('react-bootstrap');
var DialogAction = require('../actions/dialogAction');

var {
  PropTypes
  } = React;
/**
 * 全局 BaseDialog,主要提供和封装打开和关闭等事件,
 * 如果有不同样式在引用这baseDialog基础上自定义画, 好处是重要的操作直接管理, 并且后期如果替换底层实现时,可减少维护量
 * close  关闭触发的函数
 */
var Dialog = React.createClass({
  //props值属性
  propTypes:{
    isShow: PropTypes.bool,
    close: PropTypes.func,
  },

  //默认props值
  getDefaultProps(){
    return({
      isShow : true,//是否显示
      close : () => {},//关闭触发的函数
    })
  },

  //默认state值
  getInitialState(){
    return({
      isShow : this.props.isShow,
    });
  },

  componentWillReceiveProps(nextProps){
    var newState = {}
    if (nextProps.isShow) {
      newState.isShow = nextProps.isShow;
    }

    if (newState) {
      this.setState(newState);
    }
  },

  closeDialog(){
    this.setState({isShow:false} , () => {
      DialogAction.close();
      this.props.close();
    });
  },

  openDialog(){
    this.setState({isShow:true});
  },

  render(){
      let {isShow } = this.state;

      return(
            <Modal show={isShow}
                   container={this}
                   {...this.props}
                   //dialogClassName="custom-modal-lg panel-step-bg "
                   //aria-labelledby="contained-modal-title"
                   onHide={() => {}}>
                   {this.props.children}
            </Modal>
      )
  }
});

//为了方便日后扩展和维护已经替换底层实现,
// 增加了头 body 脚 对象, 实际body就够用
var DialogBody = React.createClass({

    render(){
      return(
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
      )
    }
});

var DialogHeader = React.createClass({

    render(){
      return(
        <Modal.Header>
          {this.props.children}
        </Modal.Header>
      )
    }
});

var DialogFooter = React.createClass({
    render(){
      return(
        <Modal.Footer>
          {this.props.children}
        </Modal.Footer>
      )
    }
});

Dialog.Body = DialogBody;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;

module.exports = Dialog;

