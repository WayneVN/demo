/**
 * 春训营－用户列表-表格
 * @author chenmin@joudou.com
 */

"use strict";

const React = require('react');
import ReactToastr, {ToastContainer} from "react-toastr";
import If from '../../If';
const SpringModel = require('../../../model/summerModel');
const _ = require('_');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const Table = React.createClass({
  getInitialState: function () {
    return {
      list: [],                 // 提供筛选的数据
      oldList: [],               // 原始数据
      ftype: 99,
      fclazz: 99
    };
  },

  componentDidMount: function() {
    this.getData(this.props.data.uid, this.props.selectVal);
  },

  componentWillReceiveProps: function(nextProps) {
    this.getData(nextProps.data.uid, nextProps.selectVal);
  },

  getData: function(user_id,cid) {
    SpringModel.adminUserInfo(user_id, cid, result => {
      let {
        status,
        data
      } = result;
      if (status) {
        this.filterAll(data);
      }
    });
  },

  // 过滤所有数据
  filterAll: function(data) {
    let {
      state: {
        ftype,
        fclazz
      }
    } = this;
    let _list = data;

    if (ftype != 99) {
      _list =  _.filter(_list, o => o.student_type == ftype);
    }
    if (fclazz != 99) {
      _list =  _.filter(_list, o => o.class_id == fclazz);
    }

    this.setState({
      list: _list,
      oldList: data
    });
  },

  alertMsg: function (type) {
    this.refs.alert[type](
      title,
      msg,
      {
        timeOut: 5000,
        extendedTimeOut: 1000
      }
    );
  },

  editUser: function (id) {
    let obj = _.find(this.state.list, {"user_id":id});
    this.props.setUserId(id,obj);
  },

  // 过滤用户类型
  filterType: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      ftype: v
    }, () => {
      this.filterAll(this.state.oldList);
    });
  },

  // 过滤班级
  filterClazz: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      fclazz: v
    }, () => {
      this.filterAll(this.state.oldList);
    });
  },

  render: function () {
    let {
      state: {
        list = []
      }
    } = this;
    const itemMap = {
      0: "未审核",
      1: "普通",
      2: "付费",
    };

    return (
        <div>
          <ToastContainer
             ref="alert"
             toastMessageFactory={ToastMessageFactory}
             className="toast-top-right"
             />
          <table className="table table-condensed" style={{width:'810'}}>
            <thead>
              <tr>
                <th>序号</th>
                <th>用户名</th>
                <th style={{width:180}}>邮箱</th>
                <th>班级</th>
                <th>类型</th>
                <th>注册时间</th>
                <th>信息</th>
                <th>作业列表</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td style={{width:180}}></td>
                <td>
                  <select onChange={this.filterClazz}>
                    <option value="99">请选择</option>
                    <option value="1">一班</option>
                    <option value="2">二班</option>
                    <option value="3">三班</option>
                    <option value="4">四班</option>
                    <option value="5">五班</option>
                  </select>
                </td>
                <td>
                  <select onChange={this.filterType}>
                    <option value="99">请选择</option>
                    <option value="0">未审核</option>
                    <option value="1">普通</option>
                    <option value="2">付费</option>
                  </select>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {list.map( (item,k) => {
                return  <tr key={k}>
                <td>{k+1}</td>
                <td>{item.user_name}</td>
                <td style={{width:180}}>{item.mail}</td>
                <td>{item.class_id}</td>
                <td>{itemMap[item.student_type]}</td>
                <td>{
                  moment(item.register_time * 1000 ).format('YYYY/MM/DD HH:mm')
                    }</td>
                <td>
                  <span
                      className="jd-btn jd-btn-orange"
                      onClick={event => {this.editUser(item.user_id)}}
                  >
                    修改
                  </span>
                </td>
                <td>
                  <a href={`#/campsAdmin/single/${ item.user_id }`}
                     className={`jd-btn ${item.user_id?'jd-btn-orange': 'jd-btn-gray'}`}
                  >
                    个人作业列表
                  </a>
                </td>
                  </tr>
              } )}

            </tbody>
          </table>
        </div>
    );
  }
});

module.exports = Table;
