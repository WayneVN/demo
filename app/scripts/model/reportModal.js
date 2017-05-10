"use strict";
const http = require('../util/http.js');
const res = require('../../../mock/userInfo').res;

class ReportModal {
  constructor(){
  }
  userReport(sub_id,cb) {
    let url = `/tally-api/user-report?sub_id=${sub_id}`;
    http.get(url, ( err, data ) => {
      if(data.data['1A']){
        cb(data);
      }else{
        //示例数据
        let sampleData = res['_tally-api_user-report']();
        cb(sampleData);
      }

    })
  }
}

export default new ReportModal();
