/**
 * @file 春训营－每期作业-作业列表
 * @author chenmin@joudou.com
 */
 "use strict";

const React = require('react');
const SpringModel = require('../../../model/springModel');
import If from '../../If';
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
const _ = require('_');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const SpringMap = require('../../../util/springMap');

const TaskTable = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      commit: false,
      isAdmin: this.props.isAdmin,
      userInfo: this.props.userInfo,
      job_id: this.props.params.id,
      list: [],                 // 展示数据
      oldList: [],              // 原始数据
      data_score: 1,
      analyse_num: 1,
      score_level: 2,
      commits: '',
      obj: {},
      level: 99,
      clazz: 99,
      up: 99
    };
  },

  componentDidMount: function () {
    this.getData();
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      isAdmin: nextProps.isAdmin || this.props.isAdmin,
      userInfo: nextProps.userInfo || this.props.userInfo,
      job_id: nextProps.params.id || this.props.params.id
    },() => {
      this.getAssitData(nextProps.userInfo.user_id, this.props.params.id );
    });

  },

  getData: function() {
    let {
      state: {
        userInfo: {
          user_id
        },
        job_id
      }
    } = this;

    this.getAssitData(user_id, job_id);
  },

    // 过滤班级
  filterClazz: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      clazz: v
    }, () => {
      this.filterAll(this.state.oldList);
    });
  },

  filterUp: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      up: v
    }, () => {
      this.filterAll(this.state.oldList);
    });
  },

  filterLevel: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      level: v
    }, () => {
      this.filterAll(this.state.oldList);
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

  // 过滤所有数据
  filterAll: function(data) {
    let {
      state: {
        level,
        clazz,
        up,
      }
    } = this;
    let _list = data;

    if (clazz != 99) {
      _list =  _.filter(_list, o => o.class_id == clazz);
    }
    if (level != 99) {
      _list =  _.filter(_list, o => o.score_level == level);
    }
    if (up != 99) {
      _list =  _.filter(_list, o => o.job_status == up);
    }

    this.setState({
      list: _list,
      oldList: data
    });

  },

  getAssitData: function(uid, job_id) {
    SpringModel.assitStudentsJob(uid, job_id, result => {
      let {
        status,
        data
      } = result;

      if (status) {
        this.filterAll(data);
      }
    });
  },

  getAdminData: function(uid, job_id) {
    SpringModel.adminStudentsJob(uid, job_id, result => {
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

  createTask: function () {
    this.setState({
      showCreate: !this.state.showCreate
    });
  },

  setJobId: function(job_id, student_id) {
    let item = _.find(this.state.list, o => o.student_id == student_id);
    this.setState({
      job_id: job_id,
      student_id: student_id,
      commit: !this.state.commit,
      obj: item,
      data_score: item.data_num || 1,
      analyse_num: item.analyse_num || 1,
      score_level: item.score_level || 2,
      comments: item.comments || ''
    });
  },

  openCommit: function () {
    this.setState({
      commit: !this.state.commit,
    });
  },

  subCommit: function () {
    let {
      state: {
        job_id,
        userInfo: {
          user_id: uid
        },
        data_score: data_num,
        analyse_num,
        comments,
        score_level,
        student_id
      }
    } = this;
    let obj = {
      uid,
      job_id,
      student_id,
      data_num,
      analyse_num,
      comments,
      score_level
    };

    SpringModel.correctJob(obj, result => {
      if(result.status) {
        this.alertMsg('success','批改成功','');
        this.openCommit();
        this.getData();
      }
      else {
        this.alertMsg('error','失败',result.message);
      }
    });

  },

  // 数据得分
  dataScore: function(e) {
    let {
      target: {
        value
      }
    } = e;
    this.setState({
      data_score: value
    });
  },

  analyseNum: function(e) {
    let {
      target: {
        value
      }
    } = e;
    this.setState({
      analyse_num: value
    });
  },

  Comments: function(e) {
    let {
      target: {
        value
      }
    } = e;

    this.setState({
     comments: value
    });
  },

  scoreLevel: function (e) {
    let {
      target: {
        value
      }
    } = e;

    this.setState({
      score_level: value
    });
  },

  renderCommit: function() {
    let {
      state: {
        commit,
        list = [],
        job_id,
        student_id,
        obj
      }
    } = this;


    return (
      <div className="custom-modal-fixed">
      <Modal show={commit}
             dialogClassName="custom-modal-lg panel-step-bg custom-modal-fixed"
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.openCommit}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.openCommit}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp">
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <div className="panel-row">
                <label >用户名</label>
                <p>{obj.user_name}</p>
              </div>
              <div className="panel-row">
                <label >数据得分</label>
                <select defaultValue={obj.data_num} onChange={this.dataScore} >
                  {_.range(1,11).map((item,k) => {
                    return <option value={item} key={k}>{item}</option>
                  })}
                </select>
              </div>
              <div className="panel-row">
                <label >分析得分</label>
                <select defaultValue={obj.analyse_num} onChange={this.analyseNum} >
                  {_.range(1,11).map((item,k) => {
                    return <option value={item} key={k}>{item}</option>
                  })}
                </select>
              </div>
              <div className="panel-row">
                <label >备注</label>
                <textarea value={this.state.comments} onChange={this.Comments} />
              </div>
              <div className="panel-row">
                <label for="">评价</label>
                <select defaultValue={obj.score_level} onChange={this.scoreLevel}>
                  <option value="2">普通</option>
                  <option value="1">很水</option>
                  <option value="3">优秀</option>
                </select>
              </div>
            </div>
            <div className="panel-footer">
              <span className="btn-step-next flr" onClick={this.openCommit} >
                关闭
              </span>
              <span className="btn-step-next flr" onClick={this.subCommit}>
                提交
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    );
  },

  render: function () {
    let {
      state: {
        list = [],
        commit,
      }
    } = this;

    return (
      <div>
        <ToastContainer ref="alert" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
        {commit ? this.renderCommit() : <noscript></noscript>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>序号</th>
              <th>用户名</th>
              <th>班级</th>
              <th>准时</th>
              <th>评价</th>
              <th>提交时间</th>
              <th>作业下载</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
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
                <select onChange={this.filterUp}>
                  <option value="99">请选择</option>
                  <option value="1">准时</option>
                  <option value="0">未交</option>
                  <option value="2">晚交</option>
                </select>
              </td>
              <td>
                <select onChange={this.filterLevel}>
                  <option value="99">请选择</option>
                  <option value="2">普通</option>
                  <option value="1">很水</option>
                  <option value="3">优秀</option>
                </select>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {
              list.map((item,k) => {
                return <tr key={k}>
                  <td>{k+1}</td>
                    <td>{item.user_name}</td>
                      <td>{item.class_id}</td>
                        <td>{SpringMap.jobStatus[item.job_status]}</td>
                          <td>{SpringMap.jobScoreLevel[item.score_level]}</td>
                            <td>
                                {
                                item.job_submit_time?
                                moment(item.job_submit_time * 1000).format('YYYY/MM/DD HH:mm'):
                                ''
                                  }
                            </td>
                            <td>
                                <If when={item.feedback_file_link}>
                                    <a href={`/jobfiles${ item.feedback_file_link }`}
                                         target="_blank">
                                        点击下载
                                      </a>
                                </If>
                             </td>
                            <td>
                                <span
                                     className="jd-btn jd-btn-orange"
                                     onClick = {event => {this.setJobId(item.job_id,item.student_id)}}
                                    >
                                    批改
                                </span>
                            </td>
                  </tr>
                    })
                  }

          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = TaskTable;
