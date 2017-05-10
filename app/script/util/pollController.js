/**
 * @file 轮询控制
 * @author min.chen@joudou.com
 */
var DateUtil = require('./dateUtil');
var _ = require('lodash');
var http = require('./http');

var pollController = {

  /**
   * @type {Object} cache
   *
   * @private
   * @property {Object} stock 存储股票注册的信息
   * @property {Object} index 存储指数注册的信息
   */
  _cache: {
    stock: {},
    index: {}
  },

  /**
   * @type {number}  轮询间隔
   *
   * @const
   * @private
   */
  _TIME: 3000,

  /**
   * @function 获取handlerid
   * @private
   * @return {string}
   */
  _getHandlerId: function() {
    return (+new Date()) + '-' + Math.random();
  },

  /**
   * @function 增加股票轮询
   *
   * @param {Array<string>} stockIds
   * @param {Function} callback
   * @param {boolean} needRequest  第一次是否需要请求
   *
   * @return {string} handler唯一标识符，用来remove 
   */
  addStockHandler: function(stockIds, callback, needRequest) {
    var me = this;
    var handlerId = me._getHandlerId();

    me._cache.stock[handlerId] = {
      stockIds: stockIds,
      callback: callback
    }

    if (needRequest) {
      me._requestStockInfo();
    }

    return handlerId;
  },

  /**
   * @function 删除股票轮询
   *
   * @param {string} handlerId
   */
  removeStockHandler: function(handlerId) {
    var me = this;

    if (me._cache.stock[handlerId]) {
      delete me._cache.stock[handlerId];
    }
  },

  /**
   * @function 增加指数轮询
   *
   * @param {Function} callback
   * @param {boolean} needRequest
   *
   * @return {string} handler唯一标识符，用来remove 
   */
  addIndexHandler: function(callback, needRequest) {
    var me = this;
    var handlerId = me._getHandlerId();

    me._cache.index[handlerId] = callback;

    if (needRequest) {
      me._requestIndexInfo();
    }

    return handlerId;
  },

  /**
   * @function 删除指数轮询
   *
   * @param {string} handlerId
   */
  removerIndexHandler: function(handlerId) {
    var me = this;

    if (me._cache.index[handlerId]) {
      delete me._cache.index[handlerId];
    }
  },

  /**
   * @function 开始轮询
   * @private
   */
  _start: function() {
    var me = this;
    setInterval(function() {
      if (new DateUtil()
        .isInRtRanges()) {
        me._requestStockInfo();
        me._requestIndexInfo();
      }
    }, me._TIME);
  },

  /**
   * @function 请求股票数据
   * @private
   */
  _requestStockInfo: function() {
    var me = this;
    var stockIds = me._getStockIds();
    var codes = stockIds.join(',');

    if (!stockIds.length) {
      return;
    }

    http.get(`/stockinfogate/stock/realtimeinfo?stockids=${codes}`,
      function(error, data) {
        if (data.status) {
          me._formatData(data.data);
          me._dispatchStock(error, data);
        }
      });
  },

  /**
   * @function 新接口把数据格式给变了，这里做一下统一的调整
   * @private
   */
  _formatData: function (data) {
    _.forEach(data, function (item) {
      item.stock_id = item.stockid;
      item.trade_status = item.tradestatus;
      item.last_trade_price = item.origin.lastclose;
      item.realtime_price = item.origin.newprice;
    })
  },

  /**
   * @function 请求指数数据
   * @private
   */
  _requestIndexInfo: function() {
    var me = this;
    var flag = false;
    const url =
      `/stockinfogate/indexqt/realtimeinfo?indexids=000001.SH,399001.SZ,399005.SZ,399006.SZ`;
    _.forEach(me._cache.index, function(item) {
      flag = true;
    });

    if (!flag) {
      return;
    }

    http.get(url, function(error, data) {
      me._dispatchIndex(error, data);
    });
  },

  /**
   * @function 获取注册股票代码
   * 
   * @private
   * @return {Array<string>} stockIds
   */
  _getStockIds: function() {
    var me = this;
    var result = [];

    _.forEach(me._cache.stock, function(item) {
      result = result.concat(item.stockIds);
    });

    return _.uniq(result);
  },

  /**
   * @function stock数据分发调度
   *
   * @private
   * @param {Object | null} error
   * @param {Object} data
   */
  _dispatchStock: function(error, data) {
    var me = this;
    var value = data.data;

    _.forEach(me._cache.stock, function(item) {
      item.callback(data.data);
    });
  },

  /**
   * @function 指数数据分发调度
   *
   * @private
   * @param {Object | null} error
   * @param {Object} data
   */
  _dispatchIndex: function(error, data) {
    var me = this;

    _.forEach(me._cache.index, function(item) {
      item(data);
    });
  }

};

pollController._start();

module.exports = pollController;
