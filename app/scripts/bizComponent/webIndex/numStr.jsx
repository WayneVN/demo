'use strict';
/**
 * 当日涨跌幅数字不同占位符格式处理
 * @type {*|exports|module.exports}
 */
var React = require('react');


var NumStr = React.createClass({

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  },

    render() {
      let {num} = this.props;

      let spans = [];

      if(!num && num !== 0) {
        return <noscript /> ;
      }else {
        for(let i =0; i < num.length;i++){
          let _char = num.charAt(i);
          switch(_char) {
              case '.' :
                spans.push(<span className="dot">{_char}</span>); break;
              case '(' :
                spans.push(<span className="leftBracket">(</span>); break;
              case ')' :
                spans.push(<span className="rigthBracket">)</span>); break;
              case '+' :
              case '-' :
                spans.push(<span className="sign">{_char}</span>); break;
              default:
                spans.push(<span className="num">{_char}</span>);
          }
        }
      }


      return(<div className = 'num-str'>
        {spans}
        </div>)
    }


});

module.exports = NumStr;

