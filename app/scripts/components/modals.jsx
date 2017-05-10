'use strict';

var React = require('react/addons');

var _require = require('pui-react-typography');

var DialogAction = require('../actions/dialogAction')

var DefaultH4 = _require.DefaultH4;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Modal = React.createClass({
  displayName: 'Modal',

  propTypes: {
    title: React.PropTypes.string
  },

  componentDidMount: function componentDidMount() {
    document.body.addEventListener('keyup', this.onKeyUp, false);
  },

  componentWillUnmount: function componentWillUnmount() {
    document.body.removeEventListener('keyup', this.onKeyUp);
  },

  getInitialState: function getInitialState() {
    return { isVisible: true };
  },

  open: function open() {
    this.setState({ isVisible: true });
  },

  close: function close() {
    DialogAction.close();
    this.setState({ isVisible: false });
  },

  onKeyUp: function onKeyUp(e) {
    if (e.keyCode === 27) {
      this.close();
    }
  },

  render: function render() {
    var modalInnards = this.state.isVisible ? React.createElement(
      'div',
      { className: 'modal modal-basic', style: { display: 'block' }, key: 'bananas' },
      React.createElement('div', { className: 'modal-backdrop fade in', onClick: this.close, style: { height: window.innerHeight } }),
      React.createElement(
        'div',
        { className: 'modal-dialog ' +this.props.clazz },
        React.createElement(
          'div',
          { className: 'modal-content '+this.props.clazz },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'button',
              { type: 'button', className: 'close', onClick: this.close },
              React.createElement(
                'span',
                null,
                '×'
              ),
              React.createElement(
                'span',
                { className: 'sr-only' },
                'Close'
              )
            ),
            React.createElement(
              DefaultH4,
              { className: 'modal-title' },
              this.props.title
            )
          ),
          this.props.children
        )
      )
    ) : null;

    return React.createElement(
      ReactCSSTransitionGroup,
      { transitionName: 'modal-fade' },
      modalInnards
    );
  }
});

 var ModalBody = React.createClass({
  displayName: 'ModalBody',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'modal-body' },
      this.props.children
    );
  }
});


var ModalFooter = React.createClass({
  displayName: 'ModalFooter',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'modal-footer' },
      this.props.children
    );
  }
});

module.exports = { Modal: Modal, ModalBody: ModalBody, ModalFooter: ModalFooter };
