/**
 *
 * 公式计算相关
 * Created by whc on 16/5/20.
 */

const IndexData = {
  "000001.SH": {name: '上证', longName: '上证指数'},
  "399001.SZ": {name: '深证', longName: '深证成指'},
  "399006.SZ": {name: '创指', longName: '创业板指'},
  "399005.SZ": {name: '中小', longName: '中小板指'},
};
var numeral = require('numeral');

var Calculation = {

  /*
   * Created by chenmin
   * @param result [{},{}]
   */
  indexData(result) {
    let list = result.data;
    let datas = [];
    for(let i = 0; i < list.length; i++) {
      let id = list[i].indexid;
      datas.push({
        code: id,
        name: IndexData[id].name,
        longName: IndexData[id].longName,
        number: numeral(list[i].newprice).format('0.00'),
        delta: numeral(list[i].newprice - list[i].lastclose).format('0.00'),
        rate: numeral(list[i].changeratio/100).format('0.00%')
      })
    }
    return datas;
  },

    /**
     *实时指数数据
     * @param index_current 数组 //实时指数数据
     * @param index_last_day 数组 //上一个交易日指数数据
     */
    indexDataOld(index_current, index_last_day) {
        let datas = [],
            indexDataMap = new IndexData();
        for (let key in index_current) {
            let currentData = index_current[key],
                lastDayData = index_last_day[key];
            // * 指数增长量: index_current - index_last_day
            // * 指数增长率: (index_current - index_last_day) / index_last_day

            let indexObj = indexDataMap[key];

            datas.push({
                code: key,
                name: indexObj.name,
                longName: indexObj.longName,
                number: currentData,
                delta: currentData - lastDayData,
                rate: (currentData - lastDayData) / lastDayData,
            })
        }

        return datas;
    },

    /**
     * 每日一股 计算 ,可以考虑和自选股合并
     * @param stock_real_price 实时股价
     * @param stock_latest_price  最近交易日股价
     * @param stock_latest_price_from_addition 添加当天收盘价
     *
     * @param status  0 停牌
     */
    riseAndFall(stock_real_price, stock_latest_price, stock_latest_price_from_addition, status) {
        let riseAndFall = 0; //涨跌幅
        let riseAndFallPer = 0; // 涨跌幅 百分比
        let cumulativeDecline = 0; // 累计涨跌幅
        let cumulativeDeclinePer = 0; // 累计涨跌幅 百分比

        let realPriceF = stock_real_price ? parseFloat(stock_real_price) : 0;
        let latestPriceF = stock_latest_price ? parseFloat(stock_latest_price) : 0;
        if (latestPriceF != 0) {
            riseAndFall = (realPriceF - latestPriceF);
            riseAndFallPer = riseAndFall / latestPriceF;
        }

        let latestPriceFormAddF = stock_latest_price_from_addition ? parseFloat(stock_latest_price_from_addition) : 0;
        if (latestPriceFormAddF != 0) {
            cumulativeDecline = (realPriceF - latestPriceFormAddF);
            cumulativeDeclinePer = cumulativeDecline / latestPriceFormAddF;
        }

        return ({
            stockRealPrice: numeral(realPriceF).format('0.00'), // 保留两位小数
            riseAndFall: status === 0 ? '__' : numeral(riseAndFall).format('0.00'), // 保留两位小数
            riseAndFallStr: status === 0 ? '__' : numeral(riseAndFall).format('+0.00').toString(),
            riseAndFallPer: status === 0 ? '停牌' : numeral(riseAndFallPer).format('0.00%'), //格式化成 %
            riseAndFallPerStr: status === 0 ? '停牌' : numeral(riseAndFallPer).format('+0.00%'), //
            cumulativeDecline: numeral(cumulativeDecline).format('0.00'), // 保留两位小数
            cumulativeDeclinePer: cumulativeDeclinePer, //格式化成 %
            cumulativeDeclinePerStr: numeral(cumulativeDeclinePer).format('+0.00%'),
        })
    },
}


module.exports = Calculation;
