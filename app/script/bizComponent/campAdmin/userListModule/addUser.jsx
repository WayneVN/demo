/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "夏令营－导入用户"
 */

"use strict";

const React = require('react');
import AttachMent from '../../../components/record/common/attachment';
const SpringModel = require('../../../model/summerModel');
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";

const AddUser = React.createClass({
  getInitialState: function () {
    return {
      files: null,
      filesfz: null,
      userInfo: this.props.userInfo,
      title: ''
    }
  },

  getDefaultProps: function() {
    return {
      show: false,
      data: {}
    }
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
    this.postFile();
  },

  postFile: function () {
    var data = new FormData();
    let url =  `/camp/admin/addStudents`;

    $.each(this.state.filesfz, (key, value) => {
      data.append('file', value);
    });
    data.append('uid', this.props.data.uid);
    data.append('course_id',this.props.selectVal);


    SpringModel.upload(url, data, result => {
      const {
        status,
        message = ''
      } = result;

      if (status) {
        this.props.alert('success', '导入成功', '');
        this.hide();
      }
      else {
        this.props.alert('error', '导入失败', message);
      }
    });
  },

  render: function () {
    const {
      props: {
        show,
        item
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
            <img src="/images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.hide}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp">
              导入用户
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <hr/>
              <span>文件上传：</span>
              <AttachMent onChangeFile={this.onChangeFilesfz}
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

module.exports = AddUser;
