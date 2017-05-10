/**
 * 站内信相关
 * Created by whc on 16/6/23.
 */
"use strict";
const http = require('../util/http.js');

var MessageModel = {

    //用户反馈站内信
    getFeedbacks(callback) {
      var url = `/feedback/messages`;
      http.get(url,(error,data) => {
        if(data.status) {
          callback(data.data)
        }else{
          console.error(data.message);
          callback({});
        }
      });
    },

    //反馈已解决标记 reply_status值域 0未读,1已读,2联系客服 3已解决
    resolveFeedback(reply_id, callback) {
      this._mackStatus(reply_id, '3', callback);
    },

    //反馈已读标记 reply_status值域 0未读,1已读,2联系客服 3已解决
    hasReadFeedback(reply_id, callback) {
      this._mackStatus(reply_id, '1', callback);
    },

    //联系客服
    hasLinkService(reply_id, callback) {
      this._mackStatus(reply_id, '2', callback);
    },

    //reply_status值域 0未读,1已读,2联系客服 3已解决
    _mackStatus(reply_id, reply_status, callback) {
      var url = `/feedback/mark`;
      http.post(url,{
        reply_status: reply_status,
        reply_id: reply_id,
      },(err,data) => callback(data));
    },

    //系统站内信
    getMessages(callback) {
      var url = `/system-messages/list`;
      http.get(url,(error,data) => {
        if(data.status){
          callback(data.data)
        }else{
          console.error(data.message);
          callback({});
        }

      });
    },

    //系统站内信已读标记
    hasReadMessage(message_id, callback) {
      var url = `/system-messages/${message_id}/read`;
      http.post(url, {}, ( err, data ) => callback(data));
    },

    //获取未读消息数
    getUnreadmsg(callback) {
      var sysMsgUrl =`/system-messages/unreadmsg`;
      var fbMsgUrl =`/feedback/unreadmsg`;

      http.get(sysMsgUrl,(err,sysData) => {
        http.get(fbMsgUrl,(err,fbData) => {
            var sysUnreadMsg = sysData.status ? sysData.data.count : 0;
            var fbUnreadMsg = fbData.status ? fbData.data.count : 0;
            callback(sysUnreadMsg + fbUnreadMsg);
        }
        )
      })
    }



}

module.exports = MessageModel;
