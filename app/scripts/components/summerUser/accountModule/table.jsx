/**
 * 夏训营－我的帐户-个人作业列表
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const SummerModel = require('../../../model/summerModel');
const SpringMap = require('../../../util/springMap');
const logger = require('../../../util/logger');
const _ = require('lodash');
import AttachMent from '../../../components/record/common/attachment';
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
import If from '../../If';
const $ = require("jquery");
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
const moment = require('moment');

const Table = React.createClass({
  getInitialState: function () {
    return {
      show: false,
      showEvaluate: false,
      timebeg: '',
      timeend: '',
      files: [],
      disabledBtn: true,
      list: [],
      commit: {},
      isdow: false,//是否可以下载，上传过作业的可以
      jobid: null,
      dowUrl: '',
    }
  },

  componentDidMount: function() {
    this.getData();
  },

  getData: function () {
    SummerModel.getJobList(this.props.data.uid, this.props.params.courseId, result => {
      let {
        status,
        data = [],
        message = ""
      } = result;
      let _pushObj = {
        job_id: -1,
        job_title: '',
        job_status: 0,
        job_submit_time: '',
        job_score_level: 0
      };
      if (status) {
        this.setState({
          list: data.map((item,k) => {
            // 转换一下数据
            item.job_status = SpringMap.jobStatus[+item.job_status];
            item.job_score_level = SpringMap.jobScoreLevel[+item.job_score_level];
            item.job_submit_time = item.job_submit_time?
              moment(item.job_submit_time * 1000).format('YYYY/MM/DD HH:mm'):
              '';
            return item;
          })
        });
      }
      else {
        this.alertMsg('error','错误',message);
      }
    })
  },

  // 切换上传弹框状态
  checkModal: function () {
    logger.log({
      target: 'summer_account_open_upload'
    });
    this.setState({
      show: !this.state.show
    });
  },

  // 切换评论弹框
  checkEvaluate: function () {
    logger.log({
      target: 'summer_account_open_checkEvaluate'
    });
    this.setState({
      showEvaluate: !this.state.showEvaluate
    });
  },

  openUpload: function(jobid, isdow, timebeg, timeend) {

    const {
      props: {
        params: {
          courseId,
        },
        data: {
          uid,
          courses
        }
      }
    } = this;
    //let obj = _.find(courses, ['course_id', courseId]) || {};

    if (isdow) {
      SummerModel.getmyAnswer(uid, jobid, courseId, result => {
        this.setState({
          show: !this.state.show,
          jobid: jobid,
          isdow: isdow,
          timebeg: timebeg,
          timeend: timeend,
          dowUrl: `/camp/jobfiles/${this.props.params.courseId}${result.data.my_answer}`
        });
      });
    }
    else {
      this.setState({
        show: !this.state.show,
        jobid: jobid,
        isdow: isdow,
        timebeg: timebeg,
        timeend: timeend,
      });
    }
  },

  // 打开评论框，发送请求
  openEvaluate: function (jobid) {
    const {
      props: {
        params: {
          courseId,
        },
        data: {
          uid,
          courses
        }
      }
    } = this;

    SummerModel.jobComments(uid, jobid, courseId, result => {
      let {
        status,
        data,
      } = result;

      if (status) {
        this.setState({
          commit: data,
          showEvaluate: true
        });
      }
    });
  },

  alertMsg: function (type, title, msg) {
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  onChangeFiles: function (files) {
    this.setState({
      files: files,
      disabledBtn: false
    });
  },

  upload: function () {
    let {
      state: {
        files = [],
      }
    } = this;

    if (files.length < 1) {
      this.setState({disabledBtn: true});
      return ;
    }

    this.postFile();
  },

  // 上传文件
  postFile: function () {
    var data = new FormData();
    let url =  `/camp/students/jobUpload`;

    $.each(this.state.files, function(key, value) {
      data.append('file', value);
    });
    data.append('uid', this.props.data.uid);
    data.append('job_id',this.state.jobid);
    data.append('course_id',this.props.params.courseId);

    SummerModel.upload(url, data, result => {
      const {
        status,
        message = ''
      } = result;
      if (status) {
        this.alertMsg('success',
                      '上传成功',
                      '上传成功，窗口将自动关闭。'
                     );
        this.setState({
          show: false,
          showEvaluate: false,
          files: [],
        },() => {
          this.getData();
        });
      }
      else {
        this.alertMsg('error','上传失败',message);
      }
    });
  },

  // 渲染上传作业弹出框
  renderModal: function () {
    let {
      state: {
        show,
        disabledBtn,
        isdow,
        dowUrl,
        timebeg,
        timeend
      }
    } = this;

    return show ? (
      <Modal show={true}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.checkModal}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.checkModal}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <AttachMent onChangeFile={this.onChangeFiles}
                          maxSize={1}
                          singleFileSize={ 15 * 1024 * 1024}
                          defaultIcon={'fa fa-file-pdf-o fll'}
                          fileType='.xls,.xlsx,.doc,.pdf,.txt,.docx,.rar,.zip'
              />
              <If when={isdow}>
                <a className="upload-drop-warp fll"
                   style={{
                       marginTop:10,
                       marginLeft:0,
                       width:380,
                       textAlign: 'center',
                       display: 'inherit'
                   }}
                   target="_blank"
                   href={dowUrl}>
                  下载已上传作业
                </a>
              </If>
              <br/>

              <p className="mt50">准时上交时间：{moment(timeend*1000).format('YYYY/MM/DD HH:mm')}</p>
              <p className="mt10">禁止上交时间：{moment(timebeg*1000).format('YYYY/MM/DD HH:mm')}</p>
            </div>
            <div className="panel-footer">
              <span
                className={`${ disabledBtn?'jd-btn jd-btn-gray':'btn-step-next'} flr`}
                onClick={this.upload}
                disabled={disabledBtn}>
                开始上传
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    ) : (
      <noscript />
    );
  },

  // 渲染评价框
  renderEvaluate: function () {
    let {
      state: {
        commit
      }
    } = this;
    return this.state.showEvaluate? (
      <Modal show={true}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.checkEvaluate}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.checkEvaluate}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <div className="panel-row">
                <label >数据得分</label>
                <p>{commit.data_num}</p>
              </div>
              <div className="panel-row">
                <label >分析得分</label>
                <p>{commit.analyse_num}</p>
              </div>
              <hr/>
              <span>评价：</span>
              <p>{commit.comments}</p>
            </div>
            <div className="panel-footer">
              <span
                className="btn-step-next flr"
                onClick={this.checkEvaluate} >
                关闭
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    ):(
      <noscript />
    )
  },

  render: function () {
    let {
      state: {
        list,
      }
    } = this;
    const {
      props: {
        userInfo
      }
    } = this;

    return (
        <div>
          <ToastContainer
             ref="alert"
             toastMessageFactory={ToastMessageFactory}
             className="toast-top-right"
          />
          {this.renderModal()}
          {this.renderEvaluate()}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>序号</th>
                <th>时间</th>
                <th>作业</th>
                <th>状态</th>
                <th>作业评价</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((item,k) => {
                  return <tr key={k} >
                    <td>{k+1}</td>
                      <td>{item.job_submit_time}</td>
                      <td>{item.job_name}</td>
                      <td>{item.job_status}</td>
                      <td>{item.job_status == '未提交' || item.job_score_level}</td>
                      <td>
                        <a   href="javascript:;"
                             className="jd-btn jd-btn-orange"
                             onClick={event => {
                                 this.openUpload(item.job_id,
                                                 !(item.job_status == '未提交'),
                                                 item.deadline,
                                                 item.ontime_deadline
                                 )
                               }}
                        >
                          {item.job_status == '未提交' ? '上传作业':'查看/重新上传'}
                        </a>
                        &nbsp;
                        <a   href="javascript:;"
                             className={`jd-btn ${ item.job_score_level == '未评价' ? 'jd-btn-gray' :'jd-btn-orange' }`}
                             onClick={event => {
                                 if (item.job_score_level != '未评价') {
                                   this.openEvaluate(item.job_id)
                                 }
                               } }
                             disabled={item.job_score_level == '未评价'}
                        >
                          查看批改结果
                        </a>
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

module.exports = Table;
