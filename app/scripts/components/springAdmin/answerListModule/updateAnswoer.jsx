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
const SpringModel = require('../../../model/springModel');
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
      params: item
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
    let url =  `/admin666/modifyAnswer`;

    $.each(this.state.files, (key, value) => {
      data.append('file', value);
    });

    data.append('uid', this.props.userInfo.user_id);
    data.append('title',obj.title);
    data.append('answer_id',obj.answer_id);

    SpringModel.upload(url, data, result => {
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
              <span>题目上传：</span>
              <AttachMent onChangeFile={this.onChangeFiles}
                          maxSize={20}
                          fileType=".pdf,.png,jpeg,jpg"
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
