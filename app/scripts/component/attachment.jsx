"use strict"
/**
 * 获取文件组件
 */
import React, {Component,StyleSh} from 'react';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import _ from '_';
import {ProgressBar} from 'react-bootstrap';
import If from './if';
import Tooltip from 'rc-tooltip';
import TallyModal from '../model/tallyModal';
import Storage from '../util/storage';
import SubActions from '../actions/SubActions';
const MsgError = '文件超出大小';

var AlertActions = require('../actions/AlertActions');


var Attachment = React.createClass({

  getDefaultProps() {
    return({
      special: false,
      maxSize: 99,//最多文件数
      subId: window._subId,
      disableClick: false,
      fileType: '.xls,.xlsx,.csv',
      postFile: false,
      defaultIcon: 'fa fa-file-excel-o fll',
      singleFileSize: 5 * 1024 * 1024, // 单个文件大小限制 5MB
      onChangeFile: (files) => {},//文件变动监听事件
      onMaxSize: () => {},//文件数过多事件
    });
  },

  getInitialState() {
    return({
      data: {},
      errList: [],
      files: [],
      schedule: 0,
      time: 1,
      error_msg: false,
      isTrue: false
    });
  },

  componentWillUnmount() {
    let {state:{time}} = this;
    clearInterval(time);
  },

  componentWillReceiveProps(nextProt) {
    if(nextProt.postFile && this.state.files.length >0){
      this.postFile();
    }
  },

  onDrop(files) {
    this.isRepeat(files);
  },

  isRepeat(fileList){
    let {state:{files}} = this;
    if (files.length>0) {
      let _files = [];
      _files = _.pullAllBy(files, fileList, 'name');
    }
    this.setFiles(fileList.concat(files))
  },

  setFiles(files){
    if (this.isMaxSize(files)) {
      var data = new FormData();
      $.each(files, function(key, value) {
        data.append('files[]', value);
      });
      data.append('fileType', 'log');
      data.append('fileCount', files.length);
      data.append('sub_id',this.props.subId);
      this.setState({
        files: files,
        data:data
      },() => {
        this.props.onChangeFile(this.state.files);
        this.isFileSize();
      });
    }
  },

  isMaxSize(files){
    const { props: {maxSize} } = this;
    if (files.length > maxSize) {
      AlertActions.error(`此处仅支持最多${ maxSize }个文件上传,请您重新选择`,`添加失败`);
      this.props.onMaxSize();
      return false;
    }
    return true;
  },

  isFileSize () {
    this.setState({ errList:[] });
    let {state:{files}} = this;
    let errList = [];
    files.map((item,key) => {
      if (item.size >= this.props.singleFileSize) {
        errList.push(item.name);
      }
    });
    this.setState({ errList },() => {
      if (errList.length>=1) {
        AlertActions.error(`${ errList.toString() } 文件,${ MsgError }`,`无法上传`);
      }
    });
  },


  removeFile(index) {
    let {state:{files}} = this;
    AlertActions.success(`${ files[index].name.toString() } 文件`,`已删除`);
    let _files = [];
    files.map((item,k) => {
      if (k != index) {
        _files.push(item);
      }
    });
    this.setFiles(_files);
  },

  render () {
    let {files,errList,schedule,error_msg,isTrue} = this.state;
    const {fileType, defaultIcon} = this.props;
    //this.props.uploadStatus(this.state.schedule);

    return(
      <div className="com-upload-warp">
        <If when={this.props.disableClick}>
          <div className="upload-drop-warp disable">
            <p className="upload-info">
              选择上传文件
            </p>
          </div>
        </If>
        <If when={!this.props.disableClick}>
          <Dropzone ref="dropzone"
                    onDrop={this.onDrop}
                    accept={fileType}
                    onDropAccepted={this.onDropAccepted}
                    style={{borderWidth:0,margin:0,}}
          >

            <div className="upload-drop-warp">
              <If when ={files.length==0}>
                <p className="upload-info">
                  选择上传文件
                </p>
              </If>
              <div>
                {

                  files.map((file,k) => {
                    return <div className="upload-files " key={k}>
                      <div>
                        <i className={defaultIcon} />
                        <Tooltip placement="top" overlay={<span>{file.name}</span>}>
                          <p className="upload-name">
                            {file.name.length>22 ? `${ file.name.substr(0,20) }...` : file.name}
                          </p>
                        </Tooltip>
                        <i className="fa fa-times-circle fll"
                           onClick={event => {event.stopPropagation();this.removeFile(k)}} />
                      </div>
                    </div>
                    })
                  }
              </div>
            </div>

          </Dropzone>

        </If>
      </div>
    );
  }

});

module.exports = Attachment;
