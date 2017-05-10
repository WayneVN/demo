/**
 * 实时数据获取,包括当前指数
 * 当前股价等
 * @type {Object|*}
 * @private
 */
var _ = require('_');
var TallyModal = require('../model/tallyModal').default;
var BookModal = require('../model/bookModal');
var IndexData = require('../util/indexData');
var Calculation = require('../util/calculation');
var moment = require('moment');

class _Realtime {

  /**
   *
   * @param sub_id
   * @param callback({summary,position,indexData,isps})
   * summary实时净资产,当前总收益率;
   * position是所有实时股价信息,
   * indexData 是实时指数信息
   * isps 是否为平时
   * profit: this.profit,
   * property: this.property,
   * */
  constructor(sub_id,callback) {
    this.sub_id= sub_id;
    this.callback = callback;
    this.initData();

    this.initialData = { //当账簿没有值时返回初始值
      indexData: new Array(),
      isps: false,
      position: new Array(),
      profit: {date: 0,
        day_earn: 0,
        day_earn_ratio: 0,
        earn: 0,
        no_leverage_day_earn: 0,
        no_leverage_earn: 0,
        no_leverage_ratio: 0,
        ratio: 0,
      },
      property: {date: 0,
        debt_sum: 0,
        funds_balance: 0,
        net_value: 0,
      },
      summary: {dayEarn: 0,
        dayEarnRatio: 0,
        isNullData: true,
        values: 0,
      },
    }
  }


  initData(){
    this.RT_RANGES = [93000, 153300]; // 实时区间
    this.NORMAL_RANGES = [153000, 193000]; // 平时区间
    this.now = new Date();

    //从当前持仓进行获取
    TallyModal.getCurrentPositions(this.sub_id,(result) =>{
      if(!result.data){
        this.callback(this.initialData);
        return;
      }
      let data = result.data;
      let profit = {};
      let position = [];
      let property = {};
      let isps = true;
      if (data) {
        profit = data.profit || {};
        position = data.position || [];
        property = data.property || {};
        isps = false;
      }
      if (position.length > 0) {
        //股票名称和标号合并
        for (var i = 0; i < position.length; i++) {
          position[i].stock = `${position[i].stock_name} (${position[i].stock_id})`;
        }
      }

      //init data
      this.data = data;
      this.timeMap = data;
      this.position = position;
      this.cbposition = position;
      this.oldStockSumValue = _.sumBy(position,'stock_value');
      this.profit = profit;
      this.property = property;
      // isNowDay 代表数据是否为今天的
      this.isNowDay = this.timeMap.date==moment(new Date()).format('YYYYMMDD');
      // 今日是否开盘
      this.is_cur_date_open = this.timeMap.is_cur_date_open;
      this.isps = isps;


      //拼股票请求url参数
      var codes = [];
      _.each(this.position, function(p) {
        codes.push(p.stock_id);
      });
      this.codes = codes.join(',');

      //计算
      this.getData();

    })
  }

  _getTicker() {
    var n = this.now,
      m = n.getMinutes(),
      s = n.getSeconds();
    // h+mmss
    return [n.getHours(), m > 9 ? m : '0' + m, s > 9 ? s : '0' + s].join('') * 1;
  }

  // 是否为实时区间
  isInRtRanges = function() {
    var day = this.now.getDay(),
      isWeekend = (day === 6) || (day === 0); // 6 = Saturday, 0 = Sunday
    if (isWeekend) {
      return false;
    } else {
      var ticker = this._getTicker();
      return ticker >= this.RT_RANGES[0] && ticker <= this.RT_RANGES[1];
    }
  }

  // 是否为平时区间
  _isInNormalRanges() {
    var ticker = this._getTicker();
    return ticker >= this.NORMAL_RANGES[0] && ticker <= this.NORMAL_RANGES[1];
  }

  //获取请求参数
  getQuery() {
    return {
      codes: this.codes
    };
  }

  //计算
  getData = function() {
    let query = this.getQuery();
    TallyModal.realPrice(query, result => {
      this._transformation(result);

    });


  }
  _transformation(result){
    let data = result.data;

    //指数
    let index_current = result.index_current;
    let index_last_day = result.index_last_day;
    let indexDatas = Calculation.indexData(index_current,index_last_day);

    this.initialData.indexData = indexDatas;

    //指数结束

    let stockIds = _.keys(data);
    let {length} = stockIds;

    if(!this.property ){
      this.callback(this.initialData);
      return;
    }

    let {net_value=0} = this.property;
    let {day_earn=0} = this.profit;
    let cacheList = [];
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < this.position.length; j++) {
        if (this.position[j].stock_id == stockIds[i]) {
          let _stock_price = data[stockIds[i]];
          let _stock_value = this.position[j].stock_num * data[stockIds[i]] ; //现市值
          let _earn = _stock_value - this.position[j].stock_value + this.position[j].earn; //现盈利
          // 错误的公式：现收益率 = 现盈利 / (现市值 - 现盈利) <- 这不是真正的成本
          // 正确的公式：现收益率 = 现盈利(现市值 - 昨市值 + 昨盈利) * 昨收益率 / 昨盈亏
          // (公式推导：现收益率 ＝ 现盈利 ／ 买入成本； 昨收益率 ＝ 昨盈利 ／ 买入成本)
          let _earn_ratio = _earn * (this.position[j].earn_ratio*1) / this.position[j].earn; //现收益
          let obj = {
            build_date:this.position[j].build_date,
            buy:this.position[j].buy,
            days:this.position[j].days,
            parent_fund_id:this.position[j].parent_fund_id,
            stock_id:this.position[j].stock_id,
            stock_name:this.position[j].stock_name,
            stock_num:this.position[j].stock_num,
            stock:this.position[j].stock,
            stock_price : _stock_price,
            stock_value : _stock_value,
            earn : _earn,
            earn_ratio : _earn_ratio,
            index: j+1,
          }
          cacheList.push(obj);
        }
      }
    }



    this.compute(cacheList,indexDatas);
  }
  // 计算新旧总市值
  compute(data,indexDatas) {
    data.newStockSumValue = _.reduce(data,(memo, p)=>memo + p.stock_value * 1, 0);

    this.newStockSumValue = data.newStockSumValue;
    data.oldStockSumValue = this.oldStockSumValue;

    let summary = this.computeSummary();
    return this.callback({
      position: data,
      indexData: indexDatas,
      summary: summary,
      isps: this.isps,
      profit: this.profit,
      property: this.property,
    });
  }

  //计算总收益
  computeSummary() {

    let {
      property: {
        net_value
        },
      profit: {
        day_earn,
        day_earn_ratio
        },
      isPs,
      oldStockSumValue,
      newStockSumValue,
      is_cur_date_open,
      } = this;

    if (!this.isInRtRanges() || !is_cur_date_open) {
      return({
        values: net_value,
        dayEarn: day_earn,
        dayEarnRatio: day_earn_ratio,
        isNullData: false
      });
    }else {
      // 当前-净资产 = 旧净值 + (新市值 - 旧市值)
      var values = net_value + (parseFloat(newStockSumValue) - parseFloat(oldStockSumValue));
      // 当前-当日盈亏
      var dayEarn = values - net_value;
      // 当前-当日收益率: 当日盈亏/昨净资产
      var dayEarnRatio = dayEarn / net_value;
      return({
        values: values,
        dayEarn: dayEarn,
        dayEarnRatio: dayEarnRatio,
        isNullData: false
      });
    }

  }



}

var realtime = {
  loaded: true, // 是否正在获取
  listens: {}, // 监听者
  action: null,
  time: null,

  /**
   * 监听添加回调
   * @param name
   * @param callback
     */
  addListen: function(name,callback) {
    this.listens[name] = callback;
    //this.action = null;

    this.initTime();

    this._go();

  },

  /**
   * 删除监听
   * @param name
   */
  removeListen: function(name) {

    delete realtime.listens[name];

    if(_.isEmpty(realtime.listens)) {//没有监听就不用定时器了
      clearInterval(realtime.time);
    }
  },

  _go: function(){

    BookModal.getSubId((sub_id) => {
      if (!realtime.action || sub_id != realtime.action.sub_id ) {//subid不一致初始Realtime
        realtime.action = new _Realtime(sub_id, this._callback); //重置
      } else if(realtime.loaded){ //sub_id一样
        //1.主动请求,如果已经在等待期及时发送,正在自动发送请求只需要等待回调结构
        // 定时请求发送
        realtime.action.getData();//解决在不是实时区间时或者很碰巧同时触发时
      }

      realtime.loaded = false;

    });

  },

  _callback: function(resultData) {
    let listens = realtime.listens;
    for(let key in listens){
      if(listens[key]){
        listens[key](resultData);
      }
    }
    realtime.loaded = true;
  },

  initTime: function() {
    if(!realtime.time){//防止人为点击生成多个定时器,
        //设置定时
        realtime.time = setInterval(() => {
          // 实时的时候3秒一计算，平时就计算一次，其他时间不做计算
          if (realtime.action && !realtime.action.isInRtRanges()) {// 实时区间
            realtime._go()
          }
        },3000);
      }
  },

};



module.exports = realtime;
