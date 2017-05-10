import React, {Component,StyleSh} from 'react';
import Dropzone from 'react-dropzone';
import _ from '_';
import ReactToastr ,{ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import {ProgressBar} from 'react-bootstrap';
import If from './if';
import Tooltip from 'rc-tooltip';
import TallyModal from '../model/tallyModel';
import Storage from '../util/storage';
const MsgError = '文件超出大小';

/**
 * 获取文件组件,
 */
export default class Attachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      errList:[],
      files:[],
      schedule:0,
      time:1,
      error_msg:false,
      isTrue:false
    };
  }
  static defaultProps = {
      special:false,
      maxSize:99,//最多文件数
      subId:window._subId,
      disableClick:false,
      fileType:'.xls,.xlsx,.csv',
      postFile:false,
      defaultIcon:'fa fa-file-excel-o fll',
      singleFileSize: 5 * 1024 * 1024, // 单个文件大小限制 2MB
      onChangeFile:(files)=>{},//文件变动监听事件
      onMaxSize:()=>{},//文件数过多事件
  }

  componentDidMount () {
  }
  componentWillUnmount() {
    let {state:{time}} = this;
    clearInterval(time);
  }

  componentWillReceiveProps(nextProt){
    if(nextProt.postFile && this.state.files.length >0){
        this.postFile();
    }
  }

  _alert (type,title,msg) {
    if (type=='error') {
      this.refs.container.error(
        title ,
        msg, {
          timeOut: 5000,
          extendedTimeOut: 1000
        });
        this.setState({
          error_msg:title
        });
    } else {
      this.refs.container.success(
        title ,
        msg, {
          timeOut: 3000,
          extendedTimeOut: 1000
        });
    }
  }

  onDrop = files => {
    this.isRepeat(files);
  }
  // 剔除重复文件 依照文件名称寻找重复文件
  isRepeat(fileList){
    let {state:{files}} = this;
    if (files.length>0) {
      let _files = [];
      _files = _.pullAllBy(files, fileList, 'name');
    }
    this.setFiles(fileList.concat(files))
  }
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
      },()=>{
        this.props.onChangeFile(this.state.files);
        this.isFileSize();
      });
    }
  }
  isMaxSize(files){
    const { props: {maxSize} } = this;
      if (files.length > maxSize) {
        this._alert('error',`此处仅支持最多${maxSize}个文件上传,请您重新选择`,`添加失败`);
        this.props.onMaxSize();
        return false;
      }
    return true;
  }
  isFileSize () {
    this.setState({ errList:[] });
    let {state:{files}} = this;
    let errList = [];
    files.map((item,key)=>{
      if (item.size >= this.props.singleFileSize) {
        errList.push(item.name);
      }
    });
    this.setState({ errList },()=>{
      if (errList.length>=1) {
        this._alert('error',`${errList.toString()} 文件,${MsgError}`,`无法上传`);
      }
    });
  }
  // 轮询查看状态
  getFileStatus(){
   const STATUS_CHUNK = -1; // 上传中
    const STATUS_NEW = 0; // 新上传
    const STATUS_FINISH = 1; // 已完成
    const STATUS_PROCESSING = 10; // 处理中
    const STATUS_PROCESS_FINISH = 11; // 处理完毕
    const STATUS_PROCESS_ERROR = 12; // 处理异常
    const STATUS_PROCESS_HISTORY = 13; // 处理历史
    const STATUS_COMPUTING = 20; // 计算中
    const STATUS_COMPUTE_ERROR = 22; // 计算异常
    let time = setInterval(()=>{
      this.setState({time:time});
      let url = `/record/status?t=${new Date().getTime()}&sub_id=${this.props.subId}`;
      TallyModal.get(url,data=>{
          let {
            data: {
              upload_files,
              failed_names,
              title_lack,
              status
            }
          } = data;
        if (status == 1) {
          this._alert('success',`计算已完成`,`分析成功`);
          this.setState({
            data:{},
            errList:[],
            files:[],
            isTrue:true,
            schedule:100,
          },()=>{
            clearInterval(time);
            setTimeout(()=> {
              this.setState({
                schedule:0
              },()=>{
                this.props.cb({upload:true});
              });
            }, 1000);
          });
        }
        if (status == 22 || status == 12) {
          let errMsg = `共${upload_files}个文件,成功${upload_files-failed_names.length}个文件，失败文件：${failed_names.toString() }` ;
          this._alert('error',errMsg,`文件处理失败`);
          this.setState({
            data:{},
            errList:[],
            files:[],
            schedule:0,
          },()=>{
            clearInterval(time);
          });
        }
        this.setState({
          schedule:this.state.schedule<=98?this.state.schedule+1:this.state.schedule
        });

      })
    },2000);

  }
  // 通知服务器已确认上传文件
  ack(ids){
    let params = {
      fileType:'log',
      fileCount:1,
      fileIds:ids
    };
    params.fileCount = ids.length;
    TallyModal.ack(params,data=>{
      this.getFileStatus();
    });
  }
  postFile(){
    let baseUrl ='';
    this.setState({
      schedule:30
    });
    let {data} = this.state;
    $.ajax({
      url: `${baseUrl}/record/upload`,
      type: 'POST',
      data: data,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      processData: false,
      contentType: false,
      success :(data, textStatus, jqXHR) =>{
        if (data.status) {
          this.setState({
            schedule:60
          },()=>{
            this._alert('success',`文件正在分析`,`上传成功`);
            this.ack(data.fileIds);
          });
        } else {
          this.setState({
            schedule:0
          },()=>{
            this._alert('error',`请重新上传该文件或联系客服解决`,`处理失败`);
          });
        }
      },
      error:(jqXHR, textStatus, errorThrown)=> {
        this.setState({
          schedule:0
        },()=>{
          this._alert('error',`请重新上传该文件或联系客服解决`,`处理失败`);
        });
      }
    });
  }
  onOpenClick = e => {
    this.refs.dropzone.open();
  }
  onDropAccepted =(files,e)=> {
    // console.log(files,'onDropAccepted~');
  }
  removeFile=index=>{
    let {state:{files}} = this;
    this._alert('success',`${files[index].name.toString()} 文件`,`已删除`);
    let _files = [];
    files.map((item,k)=>{
      if (k != index) {
        _files.push(item);
      }
    });
    this.setFiles(_files);
  }
  fileUpload = e=> {
    this.postFile();
  }



  render () {
    let {
      state: {
        files,
        errList,
        schedule,
        error_msg,
        isTrue
      }
    } = this;
    const {
      props: {
        fileType,
        defaultIcon
      }
    } = this;
    return(
      <div className="com-upload-warp">
        <ToastContainer ref="container" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
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

                 files.map((file,k)=>{
                   return <div className="upload-files " key={k}>
                          <div>
                            <i className={defaultIcon} />
                             <Tooltip placement="top" overlay={<span>{file.name}</span>}>
                               <p className="upload-name">{file.name.length>22?`${file.name.substr(0,20)}...`:file.name}</p>
                             </Tooltip>
                              <i className="fa fa-times-circle fll" onClick={event=>{event.stopPropagation();this.removeFile(k)}} />
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
}
