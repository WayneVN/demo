/**
 * @file 春训营－每期作业- 创建新作业
 * @author chenmin@joudou.com
 */
 "use strict";

const React = require('react');
import AttachMent from '../../../components/record/common/attachment';
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
import If from '../../If';
const SpringModel = require('../../../model/autumnProModel');
const _ = require('_');
const $ = require('jquery');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const NewTask = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      files: null,
      userInfo: this.props.userInfo,
      title: '',
      ontime_deadline_d: '',
      ontime_deadline_t: '',
      deadline_d: '',
      deadline_t: '',
      filesfz: null,
    };
  },

  getDefaultProps: function() {
    return {
      show: false
    }
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
      }
    } = this;
    let _d = deadline_d.split('-').concat(deadline_t.split(':'));
    _d[1] = _d[1] - 1 == -1 ? '12' : _d[1] -1;
    let d = moment(_d).format('X');
    let _od = ontime_deadline_d.split('-').concat(ontime_deadline_t.split(':'));
    _od[1] = _od[1] - 1 == -1 ? '12' : _od[1] -1;
    let od = moment(_od).format('X');
    let obj = {
      uid: user_id,
      title: title,
      ontime_deadline: od,
      deadline: d
    };

    this.postFile(obj);
  },

  // 上传文件
  postFile: function (obj) {
    var data = new FormData();
    let url =  `/autumn/advanced/admin666/createJob`;

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

    data.append('uid', this.props.userInfo.user_id);
    data.append('title',obj.title);
    data.append('ontime_deadline',obj.ontime_deadline);
    data.append('deadline',obj.deadline);

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

  render: function () {
    const {
      props: {
        show
      }
    } = this;

    return (
      <Modal show={show}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.hide}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.hide}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp">
              新作业发布
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
                          singleFileSize={ 50 * 1024 * 1024}
                          fileType=".pdf,.png,jpeg,jpg"
                          maxSize={20}
                          defaultIcon={'fa fa-file-pdf-o fll'} />
              <br/>
              <span>辅助文件上传：</span>
              <AttachMent onChangeFile={this.onChangeFilesfz}
                          singleFileSize={ 50 * 1024 * 1024}
                          fileType=".zip,.rar,.7z,.pdf,.docx,.doc,.xls,.xlsx"
                          maxSize={20}
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

module.exports = NewTask;
