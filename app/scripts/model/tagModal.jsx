'use strict';
/**
 * 标签相关请求
 * @type {*|exports|module.exports}
 */
var http = require('../util/http');
var _ = require('_');

var TagModal = {

  //标签列表
  list(stock_id, callback) {
    var url = `/self-stock/tag-list?stock_id=${stock_id}`;
    http.get(url, (error, db) => callback(db.tag_list));
  },

  //创建标签
  create(stock_id, tag_content, callback) {
    var url = `/self-stock/tag-create`;
    http.post(url,
      {
        stock_id: stock_id,
        tag_content: tag_content,
      },
      (error, db ) => callback(db)
    )
  },

  //删除标签
  del(tag_id, callback) {
    var url ='/self-stock/tag-delete';
    http.post(url,
      {
        tag_id: tag_id,
      },
      (error, db ) => callback(db)
    )
  }

};

module.exports = TagModal;

