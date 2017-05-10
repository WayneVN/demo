'use strict';
import React,{Component} from 'react';

export default class If extends Component {
  static displayName = 'ComponentIf';

  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.when) {
      return this.props.children;
    } else {
      /*
      this.props.children.forEach((e)=>{
          if(e.type == "Else")
            return e;
        }
      )*/
      return (<noscript />);
    }
  }
}


