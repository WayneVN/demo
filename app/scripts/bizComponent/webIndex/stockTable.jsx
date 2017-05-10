'use strict';
/**
 * 自选股 Table
 * 制作显示用, 和数据model等获取分离,  通过list传递值
 * @type {*|exports|module.exports}
 */
var React = require('react');
var Reflux = require('reflux');
var numeral = require('numeral');
var _ = require('_');
var Tooltip = require('rc-tooltip');
var If = require('../../component/if');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var StockAction = require('../../actions/stockAction');
var AddStockStore = require('../../stores/AddStockStore');
var PollController = require('../../util/pollController');
var DialogStore = require('../../stores/dialogStore');
const LoginStore = require('../../stores/LoginStore');
var StockModal = require('./stockModal');
var FavorstockModal = require('../../model/favorstockModal');
var Loading = require('../../component/loading');
var moment = require('moment');
var Star = require('../../component/star');
var PollController = require('../../util/pollController');
var Logger = require('../../util/logger');
const TIPCOLOR = {
  '0': '#f2f2f2',
  '1': '#777',
  '2': '#ffab36'
};
var StockTable = React.createClass({
  mixins: [
    Reflux.listenTo(AddStockStore, 'onChangeData'),
    Reflux.listenTo(LoginStore,'onUserChange')
  ],
  onChangeData() {
    this.getData();
  },
  onUserChange(obj) {
    this.getData();
  },
  _pollHandlerId: '',
  getDefaultProps() {
    return {
      isAnimation: false
    }
  },
  getInitialState(){
    return {
      sortDate: false,
      needClearTr: null,
      editBar: false,
      stockObj: null,
      showTable: false, //是否展示表格
      list: [],
      stockId: '', //存储打开模拟框的id
      isShow: false,
      StockPrice: null, //实时股价接口
      tipList: null,
      openList: false, // 是否收起表格
      isAnimation: false,
      isLoading: true,
      isSelect: false, //是否操作过
      removeLast: true
    };
  },
  tipId: '',
  componentDidMount() {
    this.getData();
  },
  componentWillUnmount() {
    PollController.removeStockHandler(this._pollHandlerId)
  },
  componentWillReceiveProps(nextProps) {
    if ((this.props.isAnimation != nextProps.isAnimation) && nextProps.isAnimation) {
      this.getData(true);
    }
    else {
      this.setState({isAnimation: false});
    }
  },
  componentDidUpdate() {
    //console.log(this.state);
  },
  getTips(id) {
    if (this.tipId == id) {
      this.tipId = '';
      this.setState({
        tipList: [],
      });
    }
    else {
      this.tipId = id;
      FavorstockModal.getTips(id, (err, result) => {
        if (result && result.status) {
          this.setState({
            tipList: result.data,
            tipAll: false
          });
        }
      });
    }
  },
  //开启实时轮训
  getStockPrice() {
    let { list } = this.state;
    let stockIds = list.map(item => item.secucode);
    this._pollHandlerId = PollController.addStockHandler(stockIds, (result) => {
      this.setState({
        StockPrice: result,
        showTable: true
      });
    }, true);
  },
  // 关闭实时轮训
  stopStockPrice() {
    let stockIds = this.state.list.map(item => item.secucode);
    PollController.removeStockHandler(stockIds, (result) => {
    });
  },
  getData(isAnimation) {
    FavorstockModal.getList((err, result) => {
      if (result && result.status) {
        this.props.hasAdd(result.data);
        this.setState({
          list: result.data,
          isAnimation: isAnimation || false,
          isLoading: false
        }, ()=> {
          this.getStockPrice();
          this.props.setDataList(result.data);
        });
      }
    });
  },
  getNewList() {
    this.getData();
  },
  clickOpen() {
    this.setState({
      openList: !this.state.openList
    });
  },
  //股票顶制
  setTop(secucode) {
    let {
      state: {
        list
      }
    } = this;
    let topItem = _.find(list, o => o.secucode == secucode);
    let newList = [topItem];
    for (var i = 0; i < list.length; i++) {
      if (list[i].secucode != secucode) {
        newList.push(list[i]);
      }
    }
    this.setState({
      list: newList,
      isSelect: true
    });
  },
  delStock(secucode) {
    let {
      state: {
        list
      }
    } = this;
    if (confirm('确认删除该自选股?')) {
      if (list.length === 1) {
	this.setState({
	  removeLast: false
	})
      }
      _.remove(list, o => o.secucode == secucode)
      this.setState({
        list: list,
        isSelect: true
      });
    }
  },
  closeModal(e) {
    this.setState({
      isShow: !this.state.isShow
    });
  },
  openKLine(stockId) {
    DialogAction.open(Dialog.StockDialog, {stockId: stockId});
  },
  // 传递当前id
  stockModal(obj) {
    this.setState({
      isShow: true,
      stockObj: obj
    });
  },
  renderModal() {
    let {
      state: {
        isShow,
        stockObj
      }
    } = this;
    return (
      <If when={isShow}>
        <StockModal
            closeModal={this.closeModal}
            stockObj={stockObj}
            list={this.props.list}
            cb={this.getNewList}
        />
      </If>
    );
  },
  renderTable(item, k) {
    let Tags = item.tags.length > 0 ? item.tags.split(',') : [];
    let {
      state: {
        StockPrice = {},
        sortDate = false,
        editBar,
        isAnimation
      }
    } = this;
    let obj = _.find(StockPrice, {'stock_id': item.secucode});
    if (!obj) {
      return;
    }
    let currentPrice = obj.realtime_price;
    let lastPrice = obj.last_trade_price;
    
    // 当日涨跌
    let upPrice = (currentPrice - lastPrice) ?
                  numeral(currentPrice - lastPrice).format('0.00') :
                  '0.00';
    // 当日涨跌幅
    let range = upPrice != '0.00' ? upPrice / lastPrice : '0.00';
    //累计涨跌幅
    let sumRange = (() => {
      let nowTime = moment().format('YYYYMMDD');
      if (nowTime == item.added_date) {
        return 0;
      }
      if (item.added_price && item.added_price != '0') {
        let priceChnage = (currentPrice - item.added_price ) / item.added_price;
        return priceChnage;
      }
      return 0;
    })();
    let is = k == 0 && isAnimation ? 'css_tr animated fadeInDown' : 'css_tr';
    
    let clazz = `css_td ${ !obj.tradestatus ? '' : (upPrice > 0 ? 'color-up' : 'color-down') }`;
    let _upprice = numeral(upPrice).format('0.00').split('').reverse().map((i, keys)=> {
      if (i === '-') {
        return <span style={{width: 10,textAlign: 'center',display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
      } else {
        return <span style={{width: (i=='.'?4:7),display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
      }
    });
    let _cur = numeral(currentPrice).format('0.00').split('').reverse().map((i, keys)=> {
      return <span style={{width: (i=='.'?4:7),display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
    });
    let _sumrange = numeral(sumRange).format('0.00%').split('').reverse().map((i, keys)=> {
      let w = 0;
      if (i == '.') {
        w = 4
      } else if (i == "%") {
        w = 15
      }
      else {
        w = 7
      }
      if (i === '-') {
        w = 10;
        return <span style={{width: w, textAlign: 'center' ,display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
      }
      return <span style={{width: w ,display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
    });
    let _range = numeral(range).format('0.00%').split('').reverse().map((i, keys)=> {
      let w = 0;
      if (i == '.') {
        w = 4
      } else if (i == "%") {
        w = 15
      }
      else {
        w = 7
      }
      if (i === '-') {
        w = 10;
        return <span style={{width: w,textAlign: 'center' ,display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
      }
      return <span style={{width: w ,display: 'block',float: 'right',marginRight: 1}} key={keys}>{i}</span>
    });
    return (
      <div className={is} key={k}>

        <div className="css_td tag-show" style={{ textAlign: 'center' }}>
          <a className="img" href="javascript:;" onClick={() => { this.stockModal(item)}}>
            <i
                className={`iconfont icon-write ${ Tags.length>0?'color-bule':'' }`}
            />
            <If when={Tags.length}>
              <div className="tag-num">
                <span className="top-num">
                  {Tags.length}
                </span>
              </div>
            </If>
          </a>
        </div>

        <div className="css_td">
          <a href="javascript:;" onClick={() => {this.openKLine(item.secucode)}}>
            {item.secuname}
          </a>
        </div>

        <div className="css_td">
          <a href="javascript:;" onClick={() => {this.openKLine(item.secucode)}}>
            {item.secucode.split('.')[0]}
          </a>
        </div>

        <div
            className={clazz}
        >
          {_cur}
        </div>

        <div className={clazz}>
          { obj.trade_status == 0 ? (<span style={{marginRight: 1}}>--</span>) : (upPrice < 0 || upPrice > 0 ? _upprice : '0.00')}
          { upPrice > 0 && obj.trade_status !== 0 ? <span style={{width: 10,textAlign: 'center',display: 'block',float: 'right'}}>+</span> : '' }
        </div>

        <div
            className={clazz}
        >
          {obj.trade_status == 0 ? (<span style={{marginRight: 1}}>--</span>) : _range}
          {upPrice > 0 && obj.trade_status !== 0  ? <span style={{width: 10,textAlign: 'center',display: 'block',float: 'right'}}>+</span>:''}
        </div>

        <If when={sortDate}>
          <div className="css_td"
               style={{
                 width: 138,
                 textAlign: 'right',
                 paddingRight: 10
               }}
          >
            {moment(item.added_date.toString()).format('YYYY/MM/DD')}
          </div>
        </If>

        <If when={!sortDate}>
          <div
              className={`css_td ${ !sumRange || sumRange=='-'?'':( sumRange>0?'color-up':'color-down' )}`}
              style={{
                width: 138,
                textAlign: 'right',
                paddingRight: 10
              }}
          >
            {_sumrange}
            {sumRange>0? <span style={{width: 10,textAlign: 'center' ,display: 'block',float: 'right'}}>+</span>:''}
          </div>
        </If>

        <If when={editBar}>
          <div className="css_td"
               style={{
                 paddingLeft: 18,
                 width: 78,
                 background: '#fff'
               }}
          >
            <a href="javascript:;" className="zxg_item_btn_del" onClick={() => {this.delStock(item.secucode)}}>
              <img src="../images/del-stock.png" className="del"/>
            </a>
            <a href="javascript:;" className="zxg_item_btn_top" onClick={()=> {this.setTop(item.secucode)}}>
              <img src="../images/top.png" className="top"/>
            </a>
          </div>
        </If>

        <If when={!editBar}>
          <div className="css_td"
               style={{
                 paddingLeft: 18,
                 width: 78,
                 background: '#fff'
               }}
          >
            <a href="javascript:;">
              <i
                  className="iconfont icon-news"
                  style={{
                    color: TIPCOLOR[item.annc_status] || TIPCOLOR['0']
                  }}
                  onClick={()=>{this.getTips(item.secucode)}}
              />
            </a>
          </div>
        </If>

        <If when={Tags && Tags.length>0}>
          <div className="tag">
            <div className="bg-orange">
              {
                Tags.map((titems, k) => {
                  return <span key={k} className="user-arrow">{titems}</span>
                })
              }
            </div>
          </div>
        </If>

        {this.openTip(item.secucode)}

      </div>
    );
  },
  showTipAll() {
    this.setState({
      tipAll: !this.state.tipAll
    });
  },

  getTitle(item) {
    var temp = item.title.split('(');

    if (temp[0].indexOf('借壳') > -1) {
      return temp[0];
    }
    else {
      return temp[1].split(')')[1];
    }

  },
  openTip(id) {
    let {
      state: {
        tipList,
        tipAll
      }
    } = this;
    if (!tipList || this.tipId != id || !tipList.annc.length) {
      return (
        <noscript />
      );
    }
    let tips = (()=> {
      return tipList.annc.filter((item, k) => {
        if (tipAll) {
          return item;
        }
        else {
          if (k < 5) {
            return item;
          }
        }
      });
    })();
    return (
      <div className="tips-warp-background">
        <div className="tip-arr-top"/>
        <div className={`tips-warp ${ tipAll ? 'tips-all': '' }`}>
          {
            tips.map((item, k) => {
              return <ul className="tips-item" key={k}>
                <li>
                  {moment(item.date.toString()).format('YYYY/MM/DD')}
                </li>
                <li>
                  <i className={`iconfont icon-${ item.category }`}
                     style={{
                       marginRight: 10
                     }}
                  />
                  <a href={this.getUrl(item)} target="_blank">
                    {this.getTitle(item)}
                  </a>
                </li>
                <li>
                  <If when={typeof item.star == 'number'}>
                    <Star star={item.star} />
                  </If>
                </li>
              </ul>
            })
          }
        <If when={tipList.annc.length > 5}>
          <span
              className="tipAll"
              onClick={() => {this.showTipAll()}}
          >
            {!tipAll?'+查看全部':'-收起'}
          </span>
        </If>
        </div>
      </div>
    );
  },

  getUrl(item) {
    var url = item.url;

    if (url.indexOf('http') < 0) {
      url = '/' + item.category + '/'+ item.id + '.html';
    }

    return url;
  },
  editCheck() {
    this.setState({
      editBar: !this.state.editBar,
      tipList: null,
      isSelect: this.state.editBar,
      removeLast: true
    }, () => {
      if (!this.state.editBar) {
        Logger.log({
          target: 'favorstock_edit',
          data: {
            plt: 'pc'
          }
        });
      }
      if (this.state.isSelect) {
        let list = this.state.list.map(o => o.secucode);
        FavorstockModal.topStock({secucode: list.toString()}, (e, r)=> {
        });
      }
    });
  },
  //切换 列展示 => 累计涨跌幅
  sortColumn() {
    this.setState({
      sortDate: !this.state.sortDate
    });
  },
  render() {
    let {
      state: {
        sortDate,
        needClearTr,
        showTable,
        editBar,
        stockId,
        openList,
        list,
        isLoading,
	removeLast
      }
    } = this;
    let tableList = (() => {
      return list.filter((item, k) => {
        if (openList) {
          return item;
        }
        else {
          if (k < 5) {
            return item;
          }
        }
      })
    })();
    /* 空数据的时候整个table隐藏*/
    if ((!tableList || !tableList.length) && removeLast) {
      return (
        <div></div>
      );
    }
    if (!showTable || isLoading) {
      return (
        <Loading />
      );
    }
    else {
      return (
        <div className="stock-div">

          <div className="stock-table">
            <div className="css_tr">
              <div className="css_th"></div>
              <div className="css_th">股票名称</div>
              <div className="css_th">股票代码</div>
              <div className="css_th">股价</div>
              <div className="css_th">当日涨跌</div>
              <div className="css_th">当日涨跌幅</div>
              <div className="css_th">
                <a href="javascript:;" onClick={this.sortColumn}>
                  <i className="iconfont icon-date"
                     style={{
                       color: '#284a7d',
                       fontSize: 20,
                       verticalAlign: 'bottom'
                     }}
                  />
                  {sortDate ? '添加日期' : '累计涨跌幅'}
                </a>
              </div>
              <div className="css_th">
                <a className="jd-btn jd-btn-orange"
                   href="javascript:;"
                   onClick={this.editCheck}
                >
                  {editBar?'完成':'编辑'}
                </a>
              </div>
            </div>
            {
              tableList.map((item, k) =>{
                return this.renderTable(item, k)
              })
            }

          </div>

          {this.renderModal()}
          <If when={list && list.length>5}>
            <span
                className="openList"
                onClick={() => {this.clickOpen()}}
            >
              {!openList?'+展开':'-收起'}
            </span>
          </If>
        </div>
      )
    }
  }
});
module.exports = StockTable;
