"use strict"
const React = require('react');
const _ = require('_');
/**
 * 加载组件
 */
var Loading = React.createClass({

  propTypes:{
    loaded:React.PropTypes.bool,//是否显示加载中 false显示
  },

  getDefualtProps() {
    return{
      loaded:true,
      clazz: 'spinner'
    }
  },

  render() {
    if (this.props.loaded) {
      return this.props.children;
    }

    return (
      <div className={`loader ${ this.props.panelClazz }`}>
        <div className={this.props.clazz || 'loader-inner line-scale-pulse-out'}>
          {
            _.range(1, 6, 1).map((item, k) => {
              return <div key={k} />
            })
          }
        </div>
      </div>
    );
  }
});

module.exports = Loading;
