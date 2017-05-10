/**
 * @file 首页自选股model
 * @author min.chen@joudou.com
 */

var http = require('../util/http');

module.exports = {
  getList(callback) {
    const url = `/stockinfogate/user/favorstock/list`;
    http.get(url, (err, result) => callback(err, result));
  },

  getTips(id, callback) {
    const url = `/stockinfogate/user/favorstock/tips?secucode=${ id }`;
    http.get(url, (err, result) => callback(err, result));
  },

  delStock(obj, cb) {
    const url = `/stockinfogate/user/favorstock/delete`;
    http.post(url, obj, (err, result) => cb(err, result));
  },

  topStock(obj, cb) {
    const url = `/stockinfogate/user/favorstock/setorder`;
    http.post(url, obj, (err, result) => cb(err, result));
  },

  addTag(obj, cb) {
    const url = `/stockinfogate/user/favorstock/tag/add`;
    http.post(url, obj, (err, result) => cb(err, result));
  },

  removeTag(obj, cb) {
    const url = `/stockinfogate/user/favorstock/tag/delete`;
    http.post(url, obj, (err, result) => cb(err, result));
  },

  addStock(secucode, callback) {
    const params = {
      secucode: secucode
    };
    const url = `/stockinfogate/user/favorstock/add`;
    http.post(url, params, (err, result) => callback(err, result));
  },


}
