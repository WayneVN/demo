/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－上传流水页面－上传"
 */

const React = require('react');
const Reflux = require('reflux');
import Router, {RouteHandler, Link} from 'react-router';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import _ from '_';
import If from '../../../component/if';
import Tooltip from 'rc-tooltip';
const MsgError = '文件超出大小';
const AlertActions = require('../../../actions/AlertActions');
import TallyModal from '../../../model/tallyModal';
const logger = require('../../../util/logger');


const UploadWarp = React.createClass({
  getDefaultProps() {
    return({
      maxSize: 10,//最多文件数
      fileType: '.xls,.xlsx,.csv',
      postFile: false,
      defaultIcon: 'iconfont icon-newfile fll',
      singleFileSize: 5 * 1024 * 1024, // 单个文件大小限制 5MB
      interval: 1000 * 0.8,
      animate: 'zoomOutDown',
    });
  },

  getInitialState() {
    return {
      data:{},
      errList:[],
      files:[],
      schedule:0,
      time:1,
      error_msg:false,
      isTrue:false,
      popItem: ''
    };
  },

  componentWillUnmount() {
    clearInterval(this.state.time);
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
      data.append('fileCount', files.length);
      $.each(files, function(key, value) {
        data.append('files[]', value);
      });
      this.setState({
        files: files,
        data:data
      });
    }
  },

  btnUpload(isSend){
    if (!isSend) {
      return ;
    }
    logger.log({
      target: 'page_detail_click_upload_btn'
    });
    TallyModal.postFile(this.state.data, (err, result) => {
      if (result.status) {
        this.props.fileCallback();
        AlertActions.success(`上传成功正在解析中请稍等`,`上传成功`);
      }
      else {
        AlertActions.error(result.message,`解析失败`);
      }
    });
    this.send(isSend);
  },

  send(isSend) {
    if (!isSend) {
      return ;
    }
    let {
      state: {
        files = []
      }
    } = this;

    let [first, ...more] = files;
    this.setState({
      popItem: first
    },() => {
      setTimeout(() => {
        this.setState({
          files: more
        },() => {
          this.props.popItem(first);
          setTimeout(()=> {
            if (files.length > 0) {
              this.send(true);
            }
          },this.props.interval);
        });
      }, this.props.interval);
    });

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

  _href() {
    if (this.props.dataItem && this.props.dataItem.length) {
      window.location.href = '#/account/report';
    }
  },

  render() {
    let {
      files = [],
      errList,
      schedule,
      error_msg,
      isTrue,
      popItem = {},
    } = this.state;
    const {
      fileType,
      defaultIcon,
      animate
    } = this.props;

    return(
      <div className="warp-com-upload-warp clearfix">

        <div className="t-panel mt10">
          <div className="t-panel-body">
            <Dropzone ref="dropzone"
                      onDrop={this.onDrop}
                      accept={fileType}
                      onDropAccepted={this.onDropAccepted}
                      style={{borderWidth:0,margin:0,}}
            >
              <div className={`upload-drop-warp`} style={{width: 918}}>

                {
                  files.map((file,k) => {
                    return <div className={`upload-file animated ${popItem.name ==file.name ? animate:''}`}
                                key={k}>
                  <span className={defaultIcon} />
                  <Tooltip placement="top" overlay={<span>{file.name}</span>}>
                    <p className="upload-name">
                      {file.name.length>9 ? `${ file.name.substr(0,9) }...` : file.name}
                    </p>
                  </Tooltip>
                  <i className="fa fa-times-circle"
                     onClick={event => {
                         event.stopPropagation();
                         this.removeFile(k)
                       }}
                  />
                    </div>
                  })
                }
                    <If when ={!files.length || files.length<10 }>
                      <a className="upload-add" href="javascript:;">
                        <i className="fa fa-plus" />
                      </a>
                    </If>

              </div>
            </Dropzone>
            <p className="top-guide">
              <i className="fa fa-question-circle"></i>
              <a href="#/account/help" target="_blank">&nbsp;如何上传?</a>
            </p>
            <a className={`${ this.props.dataItem && this.props.dataItem.length? 'btn-upload':'btn-upload-dis'}`}
               href="javascript:;"
               onClick={e => { this._href() }}
            >
              查看报告
            </a>
            <a className={`${ !files.length? 'btn-upload-dis':'btn-upload'} ml10 mr10`}
               href="javascript:;"
               onClick={e => { this.btnUpload(files.length) }}
            >
              上传流水
            </a>
            <span className="upload-text-num">
              {files.length || 0}/10
            </span>

            </div>
          </div>
      </div>
    );
  }
});

module.exports = UploadWarp;
