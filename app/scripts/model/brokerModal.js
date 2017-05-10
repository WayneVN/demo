/**
 * Created by whc on 16/4/7.
 */

/**
 * 券商相关接口
 */
var TallyModal = require('./tallyModal').default ;

var BrokerModal = (function(){
  var data = {
      brokerList:[],
      terminals:[],
  };
  //提供公共方法
  var getBrokerList,getTerminalByBrokerId,getOtherTermByBrokerId,getBrokerById;

  getBrokerList = function(callback){
    TallyModal.labels(result=>{
      data.terminals = result.terminals;
      data.brokerList = result.data;
      callback(data.brokerList)
    });
  }

  /**
   *
   * @param brokerId
   * @returns {*}
   */
  getTerminalByBrokerId = function(brokerId){
    let other =null,
        list = data.terminals[brokerId],
        newList = [];

    for (var i = 0; i < list.length; i++) {
      let terminal = list[i];
      if (terminal.terminal_name == '其他') {
        terminal.small_pic_url = './images/qt_sm.jpg';
        terminal.big_pic_url = './images/qt_lg.jpg';
      }
      newList.push(terminal);
    }

     return newList;
  }

  getBrokerById = function(id){
    let broker = {};
    for(let letterKey in data.brokerList){
      broker= data.brokerList[letterKey][id];
      if(broker)
          return broker;
    }

    return broker;
  }

  getOtherTermByBrokerId = function(brokerId){
    let termList = getTerminalByBrokerId(brokerId);

    for(let i in termList){
      let ter = termList[i];
      if(ter.terminal_name == "其他"){
          return ter;
      }
    }

    return null;
  }


  return{
    getBrokerList : getBrokerList,
    getTerminalByBrokerId : getTerminalByBrokerId,
    getOtherTermByBrokerId: getOtherTermByBrokerId,
    getBrokerById : getBrokerById,
  }
})();


module.exports = BrokerModal;
