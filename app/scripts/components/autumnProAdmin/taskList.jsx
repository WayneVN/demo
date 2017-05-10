/**
 * @file 春训营－每期作业
 * @author chenmin@joudou.com
 */
 "use strict";

const React = require('react');
const Table = require('./taskListModule/table');
const NewTask = require('./taskListModule/newTask');
import ReactToastr, {ToastContainer} from "react-toastr";
const logger = require('../../util/logger');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const TaskList = React.createClass({
  getInitialState: function () {
    return {
      showCreate: false,
      isAdmin: this.props.isAdmin,
      getdata: false
    }
  },

  componentDidMount: function () {
    logger.log({
      target: 'autumnPro2016_admin_task_page'
    });
  },

  createTask: function() {
    this.setState({
      showCreate: !this.state.showCreate
    });
  },

  alertMsg: function (type, title, msg) {
    if (type == 'success') {
      this.setState({
        autoGet: !this.state.autoGet
      })
    }
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  getData: function() {
    this.setState({
      autoGet: !this.state.autoGet
    });
  },

  render: function () {
    let {
      state: {
        showCreate,
      }
    } = this;
    const {
      props: {
        isAdmin
      }
    } = this;

    return (
      <div>
        <ToastContainer ref="alert" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
        <NewTask
           hide={this.createTask}
           alert={this.alertMsg}
           show={showCreate}
           getdata={this.getData}
           {...this.props} />
        <div className="page-header">
          <h2>训练营作业列表</h2>
          <small className={isAdmin || 'hide'}>
            <a href="javascript:;"
               className="jd-btn jd-btn-orange"
               onClick={event => {this.createTask()}}
              >
              发布新作业
            </a>
          </small>
        </div>
        <Table {...this.props} getdata={this.state.autoGet}/>
      </div>
    );
  }
});

module.exports = TaskList;
