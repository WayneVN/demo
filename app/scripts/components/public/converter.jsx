import React, {Component} from 'react';
import Format from '../../util/format';
import If from './../If';
import {Link} from 'react-router';

export default class Converter extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    _type: React.PropTypes.string.isRequired,
    dataStr: React.PropTypes.string.isRequired,
    stock_id: React.PropTypes.string
  }
  state = {
    linkUri:'/'
  }
  componentDidMount () {
    let {dataStr} = this.props;
    this._exp(dataStr);
  }
  componentWillReceiveProps (nextProps) {
    let {dataStr} = this.props;
    let {dataStr:_dataStr} = nextProps;
    if (dataStr != _dataStr) {
      this._exp(_dataStr);
    }
  }
  // 匹配字符串中的股票代码 ,取括号内字符串 (****)
  _exp(str){
    let pattern = new RegExp("[0-9]{6}(.[A-Za-z]{2})","igm");
    let uri = new String(str.match(pattern));
    this.setState({
      linkUri:`/contrast/${uri.toLowerCase()}`
    });
  }
  render () {
    let {dataStr,_type} = this.props;
    let {linkUri} = this.state;
    let _isLink = _type === 'link';
    return (
      <span>
        <If when={_isLink}>
          {/* <span><Link to={linkUri} ></Link></span> */}
          <a href="javascript:;">{dataStr}</a>
        </If>
        <If when={!_isLink}>
            <span>{dataStr}</span>
        </If>
      </span>
    );
  }
}
