/**
 * Created by whc on 16/4/22.
 */
"use strict";
/**
 * 自选股
 * @type {Reflux|exports|module.exports}
 */
var Reflux = require('reflux');
var StockModal = require('../model/stockModal');
var StockAction = require('../actions/stockAction');
var TeachActions = require('../actions/teachActions');
var DialogAction = require('../actions/dialogAction');
var ScopeActions = require('../actions/scopeActions');
var Dialog = DialogAction.Dialog;
const logger = require('../util/logger');

var StockStore = Reflux.createStore({
  listenables: [StockAction],

    onGetList(formType) {
      /* StockModal.stockList((list) => {

       *   if(formType && list && list.length == 1){//进入引
       *     setTimeout(() => {TeachActions.open(Dialog.StockTeach1);} , 1 * 1000);
       *   }
       *   this.trigger({
       *     list: list,
       *     formType: formType,
       *   });
       * });*/
    },

  /**
   * 添加自选股
   * @param stock_id
   * @param formNints 添加来着自选股
   */
    onAddStock(stock_id, formType, callback) {
      logger.log({
        target: 'web_index_add_stock',
      });
      /*       StockModal.addStock(stock_id, () => {*/
        //刷新个人积分
        ScopeActions.getScope();
      /* this.onGetList(formType);*/
        if (callback) {
          callback();
        }
      /*       });*/
    },

    onDelStock(stock_id) {
      StockModal.delStock(stock_id, () => {
        /* this.onGetList();*/
      });
    },

    onSetTop(stock_id) {
      StockModal.setTop(stock_id,() => {
        /* this.onGetList();*/
      });
    }
});

module.exports = StockStore;
