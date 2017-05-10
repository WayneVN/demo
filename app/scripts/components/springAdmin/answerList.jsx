/**
 * 春训营－答案列表
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const Table = require('./answerListModule/table');
const NewTask = require('./answerListModule/newTask');
import ReactToastr, {ToastContainer} from "react-toastr";
const logger = require('../../util/logger');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);


const AnswerList = React.createClass({
  getInitialState: function () {
    return {
      showCreate: false,
      isAdmin: this.props.isAdmin
    }
  },

  createAnswer: function() {
    this.setState({
      showCreate: !this.state.showCreate
    });
  },

  componentDidMount: function () {
    logger.log({
      target: 'admin_answer_page'
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

  render: function () {
    let {
      state: {
        showCreate,
        isAdmin
      }
    } = this;

    return (
      <div>
        <ToastContainer ref="alert" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
        <NewTask hide={this.createAnswer} alert={this.alertMsg} show={showCreate} {...this.props} />
        <div className="page-header">
          <h2>训练营答案列表</h2>
          <small>
            <a href="javascript:;"
               className="jd-btn jd-btn-orange"
               onClick={event => {this.createAnswer()}}
              >
              发布新答案
            </a>
          </small>
        </div>
        <Table {...this.props} getdata={this.state.autoGet}/>
      </div>
    );
  }
});

module.exports = AnswerList;
