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
const SummerModel = require('../../../model/summerModel');
const _ = require('_');
const $ = require('jquery');
const moment = require('moment');
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const UpdataAnswer = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    const {
      props: {
        item,
        userInfo
      }
    } = this;

    return {
      files: null,
      userInfo: userInfo,
      params: item,
      filesfz: null,
    };
  },

  getDefaultProps: function() {
    return {
      show: false,
      params: {}
    };
  },

  hide: function() {
    this.props.hide();
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
        params: {
          id,
          title,
        },
      }
    } = this;

    let obj = {
      uid: user_id,
      title: title,
      answer_id: id
    };

    this.postFile(obj);
  },

  // 上传文件
  postFile: function (obj) {
    var data = new FormData();
    let url =  `/camp/admin/modifyAnswer`;

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
    data.append('answer_id',obj.answer_id);

    SummerModel.upload(url, data, result => {
      const {
        status,
        message = ''
      } = result;

      if (status) {
        this.props.alert('success', '修改成功', '');
        this.hide();
        this.props.getData();
      }
      else {
        this.props.alert('error', '修改失败', message);
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
              答案修改
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

            </form>
            <div className="panel-body">
              <hr/>
              <span>*题目上传：</span>
              <AttachMent onChangeFile={this.onChangeFiles}
                          singleFileSize={ 50 * 1024 * 1024}
                          maxSize={20}
                          fileType=".pdf,.png,jpeg,jpg"
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

module.exports = UpdataAnswer;
