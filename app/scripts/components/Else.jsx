'use strict';
import React,{Component} from 'react';

export default class Else extends Component {
  static displayName = 'ComponentElse';

  render(){
    return (this.props.when == undefined || this.props.when) ? this.props.children : null;
  }
}
