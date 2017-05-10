var $ = require("jquery"),
   TallyModal = require('./tallyModal');
/**
 * Created by whc on 16/4/1.
 * 上传流水相关
 */
class UploadModal {
  //上传文件
    postFile =function(files,subId,fromData = {},callback){

      var data = new FormData(),
          baseUrl ='';
      $.each(files, function(key, value) {
        data.append('files[]', value);
      });
      data.append('fileType', 'log');
      data.append('fileCount', files.length);
      data.append('sub_id',subId);
      data.append('file_type',fromData.fileType);
      data.append('outputname',fromData.outputName);

      data.append('record_type',fromData.fileType);
      data.append('custom_name',fromData.outputName);

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
       success :(data, textStatus, jqXHR)=>callback(null,data, textStatus, jqXHR),
       error:(jqXHR, textStatus, errorThrown)=>callback(errorThrown,{}, textStatus, jqXHR)
     });
   }

}

export default new UploadModal();
