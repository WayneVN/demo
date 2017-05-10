exports.res = {
  '_record_upload': function() {
    return {
      "status": true,
      "fileIds": [8282]
    };
  },
  '_record_ack': function() {
    return {
      "status": 1
    };
  },
  '_record_status': function() {
    return {
        "data":{
          "status":1,
          "result":null,
          "db_insert_time":1457692245,
          "record_last_day":20130709,
          "record_first_day":20130625,
          "zero_point":1,
          "title_lack": ['amount','balance'], //缺失的表头, 有效值:"amount"-发生金额,"balance"-资金余额,空数组表示不缺失
          "upload_files": 10, //本次上传文件数
          "failed_names":[ //失败任务原始文件名
              "my_bad_original_excel_1.xlsx"
          ]
      }
    }
  }
}
