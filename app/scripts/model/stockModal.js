/**
 *
 * 自选股相关请求
 * Created by whc on 16/5/20.
 */
var http = require('../util/http');
var Calculation = require('../util/calculation');
var _ = require('_');

class StockModal {

    //添加自选股
    addStock(stock_id, callback) {
      const url = `/stockinfogate/user/favorstock/add`;
      http.post(url,{
        secucode: stock_id,
      }, callback)
    }

    //删除自选股
    delStock(stock_id, callback) {
      var url = `/stockinfogate/user/favorstock/delete`;
      http.post(url, {
        secucode: stock_id,
      }, callback);
    }

    //置顶自选股
    setTop(stock_id, callback) {
      var url =`/stockinfogate/user/favorstock/setorder`;
      http.post(url, {
        secucode: stock_id,
      }, callback);
    }

    //自选股列表
    stockList(callback) {
      var url = `/self-stock/list`;
      http.get(url,(error, db) => {
        if(db && db.self_stocks){
          var self_stocks = db.self_stocks;
          if(self_stocks.length ==0){
            callback(self_stocks);
            return;
          }
          var ids = '';
          // 明明 arr.toString()能解决的问题....
          for(var i in self_stocks){
            if(i == self_stocks.length-1){
              ids += self_stocks[i].stock_id ;
            }else{
              ids += self_stocks[i].stock_id +",";
            }
          }

          this.stockInfo(ids, true, callback);

        }
      });
    }

  /**
   * 股票涨跌请求
   * @param stock_ids  多个股票,号隔开 如 600127.sh,600003.sh
   * @param user_flag
   * @param callback
     */
    stockInfo(stock_ids, user_flag, callback) {
      var url = `/stock/info?stock_ids=${stock_ids}&user_flag=${user_flag}`;

      http.get(url, (error, data) => {
        var list = [];

        let {
              stocks_real_price,
              stocks_latest_price,
              stocks_latest_price_from_addtion,
              stocks_tag,
              stocks_addition_date,
              stocks_name,
          } = data;

        for(var stock_id in stocks_real_price){

            var stock = {
              stock_id: stock_id,
              stock_name: stocks_name[stock_id],
              stock_real_price: stocks_real_price[stock_id],
              stocks_tag: stocks_tag[stock_id],
              stocks_addition_date: stocks_addition_date[stock_id],
            };

            //Calculation.riseAndFall(stock);

          var stock_latest_price = stocks_latest_price[stock_id][stock_id];

          var stock_latest_price_from_addition = 0;
          if(stocks_latest_price_from_addtion[stock_id]) {
            stock_latest_price_from_addition = stocks_latest_price_from_addtion[stock_id][stock_id];
          }

          stock.stock_latest_price_from_addition = stock_latest_price_from_addition;

          var  data = Calculation.riseAndFall(stock.stock_real_price, stock_latest_price, stock_latest_price_from_addition);

          list.push(_.assign(stock, data));
        }

        callback(list);

      })
    }

    /**
     * 股票信息
     * @param stock_ids
     * @param user_flag
     * @param callback
       */
    stockuInfo(stock_ids, user_flag, callback) {
      var url = `/stock/info`;
      http.post(url,{
          stock_ids: stock_ids,
          user_flag: user_flag,
      }, callback);
    }

}


module.exports = new StockModal();
