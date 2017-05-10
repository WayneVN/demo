/**
 * Created by whc on 16/4/4.
 */
"use strict";
var Reflux = require('reflux');
var FileUploadAction = require('../actions/FileUploadAction');
var AlertActions = require('../actions/AlertActions');
var UploadModal = require("../model/UploadModal").default;
var TallyModal = require("../model/tallyModal").default;
var DialogAction = require('../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var ScopeActions = require('../actions/scopeActions');

var FileUploadStore = Reflux.createStore({
  listenables: [FileUploadAction],
  progress : 0,
  /**
   *上传文件
   * @param files 文件
   * @param sub_id
   * @param fromData 必填
   * @param errorStep 上传失败后,点击返回跳转回来页面
   * @param title    表头
     * @param successFn  成功后的回调函数
     */
  onPostFile: function(files,sub_id,fromData,errorStep, title, successFn, errorFn) {
    UploadModal.postFile(files,sub_id,fromData,(err,data, textStatus, jqXHR)=>{
      if(err || (data && data.status.toString() == 'false')){
        AlertActions.error('请重新上传该文件或联系客服解决','文件处理失败');
        DialogAction.open(Dialog.UploadBill);
        return;
      }
      this.progress = 0;
      if(data.status){
        this.progress =20;
        let ids = data.fileIds;
        // 通知服务器已确认上传文件
        TallyModal.ack({
          fileType:'log',
          fileCount:ids.length,
          fileIds:ids,
        },()=>{});
      }

      DialogAction.open(Dialog.FileProgress ,{
        progress : this.progress,
        errorStep: errorStep,
        sub_id: sub_id,
        title: title,
        fileType: fromData.fileType,
        successFn: successFn || function() {},
        errorFn: errorFn || function() {},
      });
    });
  },


  //获取进度
  onGetProgress:function(subId,errorStep){
    let url = `/record/status?t=${new Date().getTime()}&sub_id=${subId}`,
        errMsg =null;

    TallyModal.get(url,data=>{
      let {
          upload_files,
          failed_names,
          title_lack,
          status
          } = data.data;
      if (status == 1) {
        //刷新个人积分
        ScopeActions.getScope();
        this.progress = 100;
      }else if(status == 10){
        this.progress = 40;
      }else if(status == 11){
        this.progress = 60;
      }else if (status == 22 || status == 12) {
        errMsg = `共${upload_files}个文件,成功${upload_files-failed_names.length}个文件，失败文件：${failed_names.toString() }` ;
        this.progress = 0;
      }else if(this.progress < 99){
        this.progress++;
      }

      this.trigger(errMsg,this.progress,errorStep,subId);

    });
  }

});

module.exports = FileUploadStore;



