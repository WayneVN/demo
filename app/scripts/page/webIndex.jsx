'use strict'
/**
 * web首页
 * @type {*|exports|module.exports}
 */
var React = require('react');
var Reflux = require('reflux');
var Title = require('../component/title');
var MarketIndex = require('../bizComponent/webIndex/marketIndex');
var Nints = require('../bizComponent/webIndex/nints');
var StockTable = require('../bizComponent/webIndex/stockTable');
var Macro = require('../bizComponent/webIndex/macro');
var If = require('../component/if');
var LoginStore = require('../stores/LoginStore');
var LoginActions = require('../actions/LoginActions');
var AlertActions = require('../actions/AlertActions');
var _ = require('_');
var StockSearch = require('../bizComponent/webIndex/stockSearch');
var StockAction = require('../actions/stockAction');
var StockStore = require('../stores/stockStore');
var logger = require('../util/logger');
var NintsModal = require('../model/nintsModal');
var StockModal = require('../model/stockModal');
var MergerModal = require('../model/mergerModal').default;
var DialogAction = require('../actions/dialogAction');
var Dialog = DialogAction.Dialog;

var DateUtil = require('../util/dateUtil');
var Calculation = require('../util/calculation');
var animateCss = require('animate.css-js');
var pollController = require('../util/pollController');

var UserModal = new MergerModal();
var DoumiEntry = require('../bizComponent/doumi/entry');


var WebIndex = React.createClass({

  _listPollHandlerId: '',

  _hintPollHandlerId: '',

  _userInfo: {},

  mixins: [
      Reflux.connectFilter(LoginStore,'userInfo',function(userInfo) {

      if(!_.isEmpty(userInfo) && userInfo.user_id != this._userInfo.user_id) {
        StockAction.getList();
        this._userInfo = _.cloneDeep(userInfo);
      }

      //加定时是为了避免在短时间内多次通知LoginStore ,导致验证提示多次提示;
      setTimeout(() => {this.validateEmail(_.isEmpty(userInfo));} , 500);

      return userInfo;
    }),

    Reflux.connectFilter(StockStore,'stock', function(data) {
      if(data.formType == 'nints') { //自选股动画,目前IE还不支持
        setTimeout(() => {
          this.down();
          this.up();
        }, 50);
      }

      this.removeListPoll();
      this.startListPoll(data.list);

      return data.list;
    }),
  ],

  getInitialState() {

    return({
      userInfo: {},
      stock: [],//自选股
      nints: {}, //每日一股
      hasList: [],
      nintsDate: null,
      isAnimation: false,
      addLists: []
    });
  },

  //添加自选股
  addStock(stock_id) {
    DialogAction.open(Dialog.StockDialog, {stockId: stock_id});

    // StockAction.addStock(stock_id, 'stock');
  },

  componentDidMount() {
    LoginActions.userInfo();
    logger.log({
      target: 'web_index_pv',
    });
    this.getNints(this.state.nintsDate);
  },

  componentWillUnmount: function () {
      this.removeListPoll();
      this.removeHintPoll();
  },

  startListPoll(list) {
    var me = this;
    var stockIds = [];

    _.forEach(list, function (item) {
      stockIds.push(item.stock_id);
    });

    me._listPollHandlerId = pollController.addStockHandler(stockIds, function (data) {
      var stock = me.state.stock;

      _.forEach(stock, function (item) {
        var id = item.stock_id;

        _.forEach(data, function (stockInfo) {
          if (stockInfo.stock_id.toUpperCase() == id.toUpperCase()) {
            var result = Calculation.riseAndFall(
              stockInfo.realtime_price, 
              stockInfo.last_trade_price, 
              item.stock_latest_price_from_addition
            );
            _.assign(item, result);
          }
        })

      });

      me.setState({
        stock: stock
      });
    });
  },

  removeListPoll() {
    if (this._listPollHandlerId) {
      pollController.removeStockHandler(this._listPollHandlerId);
    }
  },

  startHintPoll(stockId) {
    var me = this;

    me._hintPollHandlerId = pollController.addStockHandler([stockId], function (data) {
      var hintData = me.state.nints;
      var lastPriceFromAddition = hintData.addition_close_price;

      _.forEach(data, function (stockInfo) {
          if (stockInfo.stock_id.toUpperCase() == stockId.toUpperCase()) {
            var result = Calculation.riseAndFall(
              stockInfo.realtime_price, 
              stockInfo.last_trade_price, 
              lastPriceFromAddition
            );
            hintData = _.assign(hintData, result);
            me.setState({
              nints: hintData
            });
          }
        })

    }, true);
  },

  removeHintPoll() {
    if (this._hintPollHandlerId) {
      pollController.removeStockHandler(this._hintPollHandlerId);
    }
  },

  //是否需要验证邮箱
  validateEmail(needLogin) {
    let needValidateEmail = UserModal.needValidateEmail();
    if(needValidateEmail) {
      if(needLogin) {
         DialogAction.open(Dialog.WechatLogin);
      }else {
        UserModal.validateEmail((data) => {
          if(data.status) {
            LoginActions.userInfo();
            AlertActions.success('恭喜您已通过邮箱验证', '邮箱验证成功');
          }else {
            AlertActions.error(data.message, '邮箱验证失败');
          }
        });
      }
    }
  },

  //获取每日一股
  getNints(nintsDate) {

    NintsModal.getNints(nintsDate, nints => {
      this.setState({
        nints: nints,
        nintsDate: nints.date,
      });

      this.startHintPoll(nints.stock_id);
    });
  },

  getHasAdd(list) {
    this.setState({
      hasList: list
    });
  },
  
  hasAdd() {
    let {
      state: {
        nints,
        hasList
      }
    } = this;
    
    //是否已经添加股票
    let hasAdd = false;
    for (var i= 0; i < hasList.length; i++){
      if (nints.stock_id == hasList[i].secucode) {
        hasAdd = true;
        break;
      }
    }
    
    nints.hasAdd = hasAdd;
  },
  
  //拿到当前已有的自选股
  setDataList(arrList) {
    this.setState({
      addLists: arrList
    });
  },

  render() {

    let {
      stock,
      userInfo,
      nints,
      isAnimation
    } = this.state;
    
    this.hasAdd();

    //DialogAction.open(Dialog.Login);

    return(
      <div className="page mt50">
        <div className="page-left">

          <div>
            <Title title="市场行情" subTitle="MARKET"/>
            <MarketIndex />
          </div>

          <div className="stock">
            <Title title="自选股" subTitle="STOCK">
              <Title.Right className="mt-5 mb5">
                <StockSearch onResult={this.addStock}  />
              </Title.Right>
            </Title>

            <If when = {!_.isEmpty(userInfo)} >
              <StockTable
                  isAnimation={isAnimation}
                  hasAdd = {this.getHasAdd}
                  setDataList = {this.setDataList}
              />
            </If>
          </div>

          <div className="mt20">
            <Title title="九斗关注" subTitle ="HINTS"/>
            <Nints nints= {nints}
                   onAddStock= {this.addStockByNints}
                   onGood={this.onGood}
                   onBad = {this.onBad}
                   onNextDay={this.nextDay}
                   onPrevDay = {this.prevDay}
                   addLists ={this.state.addLists}
            />
          </div>

        </div>

        <div className="page-right">
          <Macro />
        </div>
        
        <DoumiEntry />

      </div>
    );
  },

  //下一天
  nextDay() {
    if (!this.needLogin('user_register_by_click_yestoday')) {
        logger.log({
        target: 'web_index_click_hints',
      });

      this.getNints(this.state.nints.next.date);
    }
  },

  //上一天
  prevDay() {
    if(!this.needLogin('user_register_by_click_yestoday')){
      logger.log({
        target: 'web_index_click_hints',
      });

      this.getNints(this.state.nints.prev.date);
    }
  },

  //赞
  onGood() {
    let {
      nintsDate,
      nints: {
        user,
        stock_id,
        ups,
        }
      } = this.state;
    if(!this.needLogin('user_register_by_click_goodAndBad')){
      NintsModal.addGood(stock_id, nintsDate, user.up, () =>{
        this.state.nints.user.up = !user.up;
        this.state.nints.ups = user.up ? parseInt(ups) + 1 : parseInt(ups) -1;
        this.setState({nints: this.state.nints});
      });
    }
  },

  //踩
  onBad() {
    let {
      nintsDate,
      nints: {
        user,
        stock_id,
        downs,
        }
      } = this.state;
    if(!this.needLogin('user_register_by_click_goodAndBad')){
      NintsModal.addBad(stock_id, nintsDate, user.down, () =>{
        this.state.nints.user.down = !user.down;
        this.state.nints.downs = user.down ? parseInt(downs) + 1 : parseInt(downs) -1;
        this.setState({nints: this.state.nints});
      });
    }
  },

  up() {
    /* var element1 = document.querySelector('#stock-1');
     * var element2 = document.querySelector('#stock-td-1');
     * element2.style.display = 'none';
     * //bounceInUp fadeInUpBig rotateInUpLeft rollIn zoomIn zoomInDown zoomInUp bounceInRight
     * animateCss.animate( element1, {
     *   animationName: 'rollIn',
     *   duration: 1500,
     *   callbacks: [
     *     function(){
     *       element2.style.display = 'block';
     *     }
     *   ]
     * });*/
  },

  // 如下，这是一种错误的写法，非要用jq去操作dom，一个动画效果，何必呢;
  down(callback) {
    /* var element = document.querySelector('#nints-stock');*/
    //bounceOutUp fadeOutUp fadeOutUpBig hinge rollOut  zoomOut zoomOutRight
    /* animateCss.animate( element, {
     *   animationName: 'zoomOut',
     *   duration: 1500,
     * });*/
  },

  //添加自选股
  addStockByNints() {
    let {nints} = this.state;
    if(!this.needLogin('user_register_by_click_stock')){
      StockAction.addStock(nints.stock_id, 'nints');
      StockModal.addStock(nints.stock_id, () => {
        nints.hasAdd = true;
        this.setState({
          nints: nints,
          isAnimation: true
        });
      });
    }
  },

  //是否需要登录
  needLogin(tag) {
    let {userInfo} = this.state;
    if(_.isEmpty(userInfo)) {
      new MergerModal().saveClickEve(tag);
      DialogAction.open(Dialog.WechatLogin);
      return true;
    }

    return false;
  },

});



module.exports = WebIndex;

