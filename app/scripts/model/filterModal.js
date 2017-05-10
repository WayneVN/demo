/**
 * 个股筛选相关请求
 */
// "use strict";
const http = require('../util/http.js');
const _ = require('_');
const _time = require('../util/getTime');

class FilterModal {
  onAutoGet(val, cb) {
    // var url = '/filter/search?k={params}'
    let url =`/filter/search?k=${val}`;
    http.get(url,(err, data)=> {
      let relust = err ? {} : http.searchFilter(data);
      return cb(relust);
    });
  }
  toStr(obj) {
    let str = '';
    let list = _.keys(obj);
    let key = '';
    let {_keyMap} = window;
    let _list = [];
    for (let i = 0; i < list.length; i++) {
      key = list[i];
      if (obj[key].showVal && obj[key].showVal.length > 0){
        _list =  obj[key].showVal;
      } else {
        _list = [_keyMap[key].x[obj[key].range[0]],_keyMap[key].x[obj[key].range[1]]];
      }
      if (key=='revenue'|| key=='market_value') {
        let y = 10000*10000;
        _list = [_list[0]*y,_list[1]*y];
      }
      if (key=='year_growth'|| key=='season_growth') {
        let y = 100;
        _list = [_list[0]/y,_list[1]/y];
      }
      str += `${key}=${_list.toString()}&`;
    }
    return str;
  }
  conditionsearch(obj, cb) {
    let str = this.toStr(obj);
    let url =`/companies/screener?sort_key=stock_id&${str}`;
    http.get(url,(err, data)=> {
      return cb(data);
    });
  }
  //读30条数据
  conditionsearchLg(obj, cb) {
    let str = this.toStr(obj);
    let url =`/companies/screener?page_size=30&sort_key=stock_id&${str}`;
    http.get(url,(err, data)=> {
      return cb(data);
    });
  }
  // obj ==  筛选条件，   sortObj == 排序  page==分页
  conditionsearchSort(obj, sortObj, page, cb　) {
    let str = this.toStr(obj);
    str += _.isEmpty(sortObj) ? '' : 'sort_key=' + sortObj.key + '&order=' + sortObj.order;
    str += `&page_num=${parseInt(page.pageNum)}`;
    let url = `/companies/screener?${str}`;
    http.get(url,(err, data)=> {
      return cb(data);
    });
  }
  // 获取指定个股详细信息
  getBackground(id, cb) {
    let url = `/companies/background/${id}`;
    http.get(url,(err, data)=> {
      return cb(data);
    });
  }
  // 获取图表数据
  getChartData(chart, cb) {
    let url = `/companies/${chart.dataName}/${chart.id}?start_date=${chart.time.beg}&stop_date=${chart.time.end}`;
    if (chart.dataName=='turnover_rate') {
      http.get(url,(err, data)=> {
        if (data.data&&data.data.length>0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].val = data.data[i].val*0.01;
          }
        }
        return cb(data);
      });
    } else {
      http.get(url,(err, data)=> {
        return cb(data);
      });
    }

  }
  // 获取指定个股指定指标同行业，同模块个股信息
  getSimilar(params, cb) {
    let url = `/companies/similardata/${params.id}?type=industry&`
    url += `start_date=${params.beg}&stop_date=${params.end}&`;
    url += `qtypes=${params.qtypes}&`;
    url += `page_num=${(params.page_num || 1)}&page_size=${(params.page_size || 5)}&`;
    url += `with_compared=${params.with_compared}`;
    if (params.qtypes=='turnover_rate') {
      http.get(url,(err, data)=> {
        if (data.data.turnover_rate&&data.data.turnover_rate.length>0) {
          for (var i = 0; i < data.data.turnover_rate.length; i++) {
            for (var j = 0; j < data.data.turnover_rate[i].data.length; j++) {
              data.data.turnover_rate[i].data[j].val = data.data.turnover_rate[i].data[j].val*0.01;
            }
          }
        }
        return cb(data);
      });
    } else {
      http.get(url, (err, data)=> {
        return cb(data);
      });
    }
  }
  getPrice(id,time,cb) {
    let {end} = _time.oneYear();
    let url = `/companies/price/${id}?start_date=${time}&stop_date=${end}`
    http.get(url,(err, data)=> {
      return cb(data);
    });
  }
  // 获取指定个股并购重组信息（只显示最近的一条，不考虑状态）
  getMerge(id,cb){
    let url = `/merger/stocks/${id}`;
    http.get(url, (err, data)=> {
      return cb(data);
    });
  }
  // 个股筛选三段数据
  distribution(cb){
    return cb({});
    /* let url = '/companies/distribution';
     * http.get(url, (err, data)=> {
     *   return cb(data);
     * });*/
  }

}
export default new FilterModal();
// module.exports = FilterModal;
