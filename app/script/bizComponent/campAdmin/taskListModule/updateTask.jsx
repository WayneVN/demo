/**
 * @file 春训营－每期作业- 修改作业
 * @author chenmin@joudou.com
 */
 "use strict";

const React = require('react');
import AttachMent from '../../../components/record/common/attachment';
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
import If from '../../If';
const SpringModel = require('../../../model/summerModel');
const _ = require('_');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const UpdataTask = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    const {
      props: {
        updataObj: {
          upload_time = null,
          job_title,
          ontime_deadline,
          deadline,
          job_id
        },
        userInfo
      }
    } = this;
    var times = '';
    if (upload_time) {
      times = {
        od: moment(ontime_deadline * 1000).format('YYYY-MM-DD HH:mm').split(' ')[0],
        dd: moment(ontime_deadline * 1000).format('YYYY-MM-DD HH:mm').split(' ')[1],
        ot: moment(deadline * 1000).format('YYYY-MM-DD HH:mm').split(' ')[0],
        tt: moment(deadline * 1000).format('YYYY-MM-DD HH:mm').split(' ')[1],
      };
    }

    return {
      files: null,
      userInfo: userInfo,
      title: job_title,
      job_id: job_id,
      ontime_deadline_d: times.od,
      ontime_deadline_t: times.dd,
      deadline_d: times.ot,
      deadline_t: times.tt,
      filesfz: null,
    };
  },

  getDefaultProps: function() {
    return {
      show: false
    };
  },

  hide: function() {
    this.props.hide();
  },

  componentDidMount: function () {

  },

  onChangeFiles: function (files) {
    this.setState({
      files: files,
    });
  },

  onChangeFilesfz: function (filesfz) {
    this.setState({
      filesfz: filesfz,
    });
  },


  begUpload: function() {
    let {
      state: {
        userInfo: {
          user_id
        },
        title,
        ontime_deadline_d,
        ontime_deadline_t,
        deadline_d,
        deadline_t,
        job_id
      }
    } = this;

    let _d = deadline_d.split('-').concat(deadline_t.split(':'));
    _d[1] = _d[1] - 1 == -1 ? '12' : _d[1] -1;
    let d = moment(_d).format('X');
    let _od = ontime_deadline_d.split('-').concat(ontime_deadline_t.split(':'));
    _od[1] = _od[1] - 1 == -1 ? '12' : _od[1] -1;
    let od = moment(_od).format('X');
    let obj = {
      uid: this.props.data.uid,
      title: title,
      ontime_deadline: od,
      course_id: this.props.selectVal,
      deadline: d,
      job_id: job_id
    };

    this.postFile(obj);
  },

  // 上传文件
  postFile: function (obj) {
    var data = new FormData();
    let url =  `/camp/admin/modifyJob`;

    if (!this.state.files || !this.state.files.length) {
      this.props.alert('error', '失败', '文件为空');
      return ;
    }
    $.each(this.state.files, (key, value) => {
      data.append('file', value);
    });
    $.each(this.state.filesfz, (key, value) => {
      data.append('help_file', value);
    });
    data.append('uid', this.props.data.uid);
    data.append('course_id',this.props.selectVal);
    data.append('title',obj.title);
    data.append('ontime_deadline',obj.ontime_deadline);
    data.append('deadline',obj.deadline);
    data.append('job_id',obj.job_id);

    SpringModel.upload(url, data, result => {
      const {
        status,
        message = ''
      } = result;

      if (status) {
        this.props.alert('success', '创建成功', '');
        this.hide();
        this.props.getdata();
      }
      else {
        this.props.alert('error', '创建失败', message);
      }
    });
  },

  createTask: function() {
    // SpringModel.createJob();
  },

  render: function () {
    const {
      props: {
        showUpdate
      }
    } = this;

    return (
      <Modal show={showUpdate}
             dialogClassName="custom-modal-lg panel-step-bg"
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.hide}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="/images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.hide}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp">
              作业修改
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">


            <form className="form-horizontal">
              <div className="form-group">
                <label htmlfor="inputEmail3" className="col-sm-4 control-label">标题</label>
                <div className="col-sm-5">
                  <input type="text"
                         className="form-control"
                         id="inputEmail3"
                         valueLink={this.linkState('title')}
                         />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">准时上交截至</label>
                <div className="col-sm-3">
                  <input type="date"
                         className="form-control"
                         valueLink={this.linkState('ontime_deadline_d')}
                         />
                </div>
                <div className="col-sm-2">
                  <input type="time"
                         className="form-control"
                         valueLink={this.linkState('ontime_deadline_t')}
                         />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">禁止上交截至</label>
                <div className="col-sm-3">
                  <input type="date"
                         className="form-control"
                         valueLink={this.linkState('deadline_d')}
                         />
                </div>
                <div className="col-sm-2">
                  <input type="time"
                         className="form-control"
                         valueLink={this.linkState('deadline_t')}
                         />
                </div>
              </div>
            </form>
            <div className="panel-body">
              <hr/>
              <span><span style={{color:'red'}}>*</span>题目上传：</span>
              <AttachMent onChangeFile={this.onChangeFiles}
                          maxSize={20}
                          singleFileSize={ 50 * 1024 * 1024}
                          fileType=".pdf,.png,jpeg,jpg"
                          defaultIcon={'fa fa-file-pdf-o fll'} />
              <br/>
              <span>辅助文件上传：</span>
              <AttachMent onChangeFile={this.onChangeFilesfz}
                          fileType=".zip,.rar,.7z,.pdf,.docx,.doc,.xls,.xlsx"
                          maxSize={20}
                          singleFileSize={ 50 * 1024 * 1024}
                          defaultIcon={'fa fa-file-pdf-o fll'} />
            </div>
            <div className="panel-footer">
              <span
                 className="btn-step-next flr"
                 onClick={this.hide} >
                关闭
              </span>
              <span
                 className="btn-step-next flr"
                 onClick={this.begUpload}>
                开始上传
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = UpdataTask;
