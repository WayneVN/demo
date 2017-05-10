/**
 * 春训营－用户列表
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const EditUser = require('./userListModule/editUser');
const AddUser = require('./userListModule/addUser');
const Table = require('./userListModule/table');
import ReactToastr, {ToastContainer} from "react-toastr";
const logger = require('../../util/logger');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const UserList = React.createClass({
  getInitialState: function () {
    return {
      showEdit: false,
      showAdd: false,
      userid: -1,
      item: {},
      isgetdata: false
    };
  },

  componentDidMount: function () {
    logger.log({
      target: 'autumn2016_admin_user_page'
    });
  },

  editUser: function () {
    this.setState({
      showEdit: !this.state.showEdit,
      isgetdata: !this.state.isgetdata
    });
  },

  addUser: function () {
    this.setState({
      showAdd: !this.state.showAdd,
    });
  },

  // 得到当前行用户id
  setUserId: function (id,obj) {
    this.setState({
      userid: id,
      showEdit: true,
      item: obj
    });
  },

  alertMsg: function(type, title, msg) {
    this.refs.alert[type](
      title,
      msg,
      {
        timeOut: 5000,
        extendedTimeOut: 1000
      }
    );
  },

  render: function () {
    let {
      state: {
        showEdit,
        showAdd,
        userid,
        item,
        isgetdata
      }
    } = this;

    return (
      <div>
        <ToastContainer
           ref="alert"
           toastMessageFactory={ToastMessageFactory}
           className="toast-top-right"
           />
        <EditUser hide={this.editUser}
                  show={showEdit}
                  item={item}
                  id={userid}
                  {...this.props}
                  alert={this.alertMsg}
        />
        <AddUser hide={this.addUser}
                 show={showAdd}
                 item={item}
                 id={userid}
                 {...this.props}
                 alert={this.alertMsg}
        />
        <div className="page-header">
          <h2>用户列表</h2>
            <a href="javascript:;"
               className="jd-btn jd-btn-orange"
               onClick={event => {this.addUser()}}
            >
              批量导入用户
            </a>
        </div>
        <Table {...this.props}
               setUserId={this.setUserId}
               isGetNewData={isgetdata}
               />
      </div>
    );
  }
});

module.exports = UserList;
