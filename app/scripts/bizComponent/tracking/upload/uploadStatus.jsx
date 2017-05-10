/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－上传流水页面－文件状态"
 */
"use strict";
const React = require('react');
const Reflux = require('reflux');
const moment = require('moment');
import Router, {RouteHandler, Link} from 'react-router';
const _ = require('_');

const UploadStatus = React.createClass({
  getInitialState() {
    return {
      files: this.props.statusData,
      addItem: {}
    };
  },

  getDefaultProps() {
    return {
      statusData: [],
      lastData:[],
      addItem: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.addItem ) {
      if (nextProps.addItem.name == (this.props.addItem && this.props.addItem.name)) {
        return ;
      }
      let obj = {
        record_first_day: '',
        record_last_day: '',
        ori_name: nextProps.addItem.name,
        update_date: '',
        upload_status: 3
      };
      let {
        state: {
          files: _files
        }
      } = this;
      _files.unshift(obj);
      /* 每次向列表头部添加一项 */
      this.setState({
        files: _files
      });
    }
    if (nextProps.statusData.length) {
      this.setState({
        files: this.props.statusData
      });
    }
  },

  renderItem(item, k) {
    const map = {
      1: '处理成功',
      2: '失败',
      3: '等待中'
    };
    const begTime = item.record_first_day&&+item.record_first_day>0 ?moment(item.record_first_day).format('YYYY/MM/DD'): 'Invalid date';
    const endTime = item.record_last_day&&+item.record_last_day>0 ?moment(item.record_last_day).format('YYYY/MM/DD'):'Invalid date';
    let Time = `${ begTime } - ${ endTime }`;
    if (begTime == 'Invalid date' && endTime == 'Invalid date') {
      Time = 'Invalid date';
    }

    return (
      <ul className="tracking-panel-row" key={k}>
        <li>
          <span className="iconfont icon-newfile"></span>
          {
            item.ori_name && item.ori_name.length >= 20  ? item.ori_name.substr(0,20) + '...': item.ori_name
          }
        </li>
        <li>
          {item.upload_date?moment(item.upload_date).format('YYYY/MM/DD'):item.upload_date}
        </li>
        <li>
          {`${ Time }`}
        </li>
        <li className={item.upload_status == 2 ?'color-up':''}>
          {map[item.upload_status]}
        </li>
      </ul>
    );
  },

  render() {
    let {
      state: {
        files = []
      }
    } = this;

    return (
      <div className="tracking-upload-status-warp">
        <ul className="tracking-panel-head">
          <li>文件名称</li>
          <li>上传时间</li>
          <li>交易区间</li>
          <li>文件上传状态</li>
        </ul>
        <div className="tracking-upload-panel">
          {
            files.map( (item, k) => this.renderItem(item, k))
          }
        </div>
      </div>
    );
  }
});

module.exports = UploadStatus;
