"use strict"
/**
 * 上传失败组件
 */

var React = require('react');
var _ = require('_');
var DialogThemeA = require("../../component/dialogThemeA");
var BrokerModal = require('../../model/brokerModal');
var BookModal = require('../../model/bookModal');
var SubActions = require('../../actions/SubActions');
var AlertActions = require('../../actions/AlertActions');
var If = require('../../component/if');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var FileUploadAction = require('../../actions/FileUploadAction');
var AlertActions = require('../../actions/AlertActions');
var logger = require('../../util/logger');
var FileTypeMap = require('../../util/fileType');

var UploadError = React.createClass({

  getInitialState(){

    return({
      title: this.props.title,


      brokerId: "",
      terminal: "",
      bookName: "",
      fileType: this.props.fileType,
      brokerName: "",
      sub_id: null,
    });
  },



  componentDidMount(){
    this.initData();
  },

  initData(){
    var $this = this;
    BookModal.getSubId(function(sub_id) {
      //获取账簿信息
      BookModal.getBook(sub_id, (book)=> {
        BookModal.getRecordInfo(sub_id, (recordData)=> {
          let account = recordData.user_account;
          let fileType = recordData.lastType;

          $this.setState({
            bookName: book.name,
            brokerName: account.broker_name,
            broker_id: account.broker_id,
            fileType: FileTypeMap[$this.state.fileType],
            sub_id: sub_id,
          });
        });
      });
    });
  },

  gotoHelp(e) {
    DialogAction.close();
    logger.log({
      target: 'upload_err_goto_help',
    });

  },

  render() {
    let {brokerName, bookName, fileType, title, sub_id} = this.state;

    return (

      <DialogThemeA >


        <DialogThemeA.Body>
          <div className="panel-row">

            <div className="panel-col">
              <label htmlFor="user">设置账簿名称</label>
              <span>{bookName}</span>
            </div>
            <div className="panel-col flr">
              <label htmlFor="qs">选择开户券商</label>
              <span>{brokerName}</span>
            </div>
          </div>
          <div className="panel-row">
            <label htmlFor="qs">选择文件类型</label>
            <span>{fileType}</span>
          </div>

          <div className="panel-row">
            <label className="color-error">上传失败</label>
            <span>你可以查看</span><a href={`/#/tally/help/${sub_id}`} onClick={this.gotoHelp} className="a-blue" target="_brank">帮助</a>
            <span className="flr"><a href="javascript:;" className="a-blue" onClick={()=> DialogAction.open(Dialog.UploadBill)}>重新上传</a></span>
          </div>


        </DialogThemeA.Body>

      </DialogThemeA>
    );
  },
});

module.exports = UploadError;
