/**
 * 春训营－用户列表-表格
 * @author chenmin@joudou.com
 */

"use strict";

const React = require('react');
import ReactToastr, {ToastContainer} from "react-toastr";
import If from '../../If';
const SpringModel = require('../../../model/springModel');
const _ = require('_');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const SingLeTaskList = React.createClass({
  getInitialState: function () {
    return {
      list: [],
      clazz: '',
      userName: ''
    }
  },

  componentDidMount: function() {
    this.getStudenInfo();
    this.getData();
  },

  getData: function() {
    const {
      props: {
        userInfo: {
          user_id
        },
        params: {
          sid
        }
      }
    } = this;

    SpringModel.adminStudentsJob(user_id, sid, result => {
      let {
        status,
        data
      } = result;
      if (status) {
        this.setState({
          list: data
        });
      }
    });
  },

  getStudenInfo: function() {
    SpringModel.studentsUserInfo(this.props.params.sid, result => {
      let {
        status,
        data
      } = result;

      this.setState({
        clazz: data.class_id,
        userName: data.user_name
      });

    });
  },

  alertMsg: function (type, title, msg) {
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

  changePay: function(val, job_id) {
    const {
      props: {
        userInfo: {
          user_id
        },
        params: {
          sid
        }
      }
    } = this;
    let obj = {
      uid: user_id,
      student_id: sid,
      job_id: job_id,
      paid_type: val
    };

    SpringModel.modifyPaidInfo(obj, result => {
      let {
        status,
        data
      } = result;

      if(status){
        this.alertMsg('success','修改成功','');
      }
      else {
        this.alertMsg('error','修改失败',message);
      }
    });

  },

  render: function () {
    let {
      state: {
        list = [],
        clazz,
        userName
      }
    } = this;
    const itemMap = {
      0: "未审核",
      1: "普通",
      2: "付费",
    };
    const statusMap = {
      0: '未提交',
      1: '正常提交',
      2: '晚交'
    };
    const zsMap = {
      0: '未评价',
      1: '很水',
      2: '普通',
      3: '优秀'
    };
    const pay = {
      0: '当期未付费',
      1: ' 当期已付费'
    };

    return (
        <div>
          <ToastContainer
             ref="alert"
             toastMessageFactory={ToastMessageFactory}
             className="toast-top-right"
             />
          <p>
            用户名：{userName}
          </p>
          <p>
            班级：{clazz}
          </p>
          <table className="table table-condensed">
            <thead>
              <tr>
                <th>序号</th>
                <th>期数</th>
                <th>准时</th>
                <th>评价</th>
                <th>提交时间</th>
                <th>是否付费</th>
              </tr>
            </thead>
            <tbody>
              {list.map( (item,k) => {
                  return <tr key={k}>
                          <td>{k + 1}</td>
                          <td>{item.job_name}</td>
                          <td>{statusMap[item.job_status]}</td>
                          <td>{zsMap[item.job_score_level]}</td>
                            <td>{
                                moment(item.job_submit_time * 1000).format('YYYY/MM/DD HH:mm')
                              }</td>
                            <td>
                                <select defaultValue={item.paid_type}
                                          onChange={
                                            event => {
                                              this.changePay(event.target.value, item.job_id)
                                            }
                                          }>
                                    <option value='0'>{pay['0']}</option>
                                      <option value="1">{pay['1']}</option>
                                  </select>
                              </td>
                        </tr>
              } )}

            </tbody>
          </table>
        </div>
    );
  }
});

module.exports = SingLeTaskList;
