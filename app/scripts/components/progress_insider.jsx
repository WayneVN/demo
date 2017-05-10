import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Reflux from 'reflux';
import _ from '_';
import Format from '../util/format';

export default class ProgressInsider extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    time:{
      publishing:{
        date:''
      }
    }
  }
  render () {
    let date = Format.stringDateFormat(this.props.time.publishing.publish_date);
    return(
      <div className="progress-lg">
        <ul className="pro-text">
          <li>
            <p className="active">发布</p>
            <span>{date}</span>
          </li>
          <li>
            <p>证监会审核</p>
            <span></span>
          </li>
          <li>
            <p>授权日</p>
            <span></span>
          </li>
          <li>
            <p>第一期解锁</p>
            <span></span>
          </li>
          <li>
            <p>第二期解锁</p>
            <span></span>
          </li>
          <li>
            <p>第三期解锁</p>
            <span></span>
          </li>
          <li style={{marginRight:5}}>
            <p>第四期解锁</p>
            <span></span>
          </li>
          <li>
            <p>完成</p>
            <span></span>
         </li>
        </ul>
        <div className="pro-line">
          <div className="pro-lg-d1 active"/>
          <div className="pro-lg-d2"/>
          <div className="pro-lg-d3"/>
          <div className="pro-lg-d4"/>
          <div className="pro-lg-d5"/>
          <div className="pro-lg-d6"/>
          <div className="pro-lg-d7"/>
          <div className="pro-lg-d8"/>
        </div>
      </div>

    );
  }
}
