"use strict"
/**
* 股票搜索组件
*/
var React = require('react');
var Reflux = require('reflux');
const LoginStore = require('../../stores/LoginStore');
const LoginActions = require('../../actions/LoginActions');
var SearchStore = require('../../stores/SearchStore');
var SearchActions = require('../../actions/SearchActions');
var CommonModal = require('../../model/commonModal');
var BaseSearch =require('../../component/baseSearch');
var DialogAction = require('../../actions/dialogAction');
var StockAction = require('../../actions/stockAction');
var MergerModal = require('../../model/mergerModal').default;
var Dialog = DialogAction.Dialog;
var _ = require('_');


var StockSearch = React.createClass({

  mixins: [
    Reflux.connect(LoginStore,'userInfo'),
  ],

  getInitialState() {
    return({
      userInfo: {},
      result: [],
    })
  },

  getDefaultProps() {
    return({
      onResult: () => {}
    })
  },

  componentWillMount() {
  },

  _onSearch(val) {
    let strBeg = val.indexOf('(');
    let strEnd = val.indexOf(')');
    if (strBeg >1 && strEnd > 1) {
      let str = val.substring(parseInt(strBeg) + 1 ,parseInt(strEnd));
      this.props.onResult(str);
    }
  },

  _changeCallback(val) {
    CommonModal.onAutoGet(val,(data)=>{
      this.setState({
        result:data
      });
    });
  },

  onFocus() {
    let {userInfo} = this.state;
    if(_.isEmpty(userInfo)){
      new MergerModal().saveClickEve('user_register_by_click_stock');
      DialogAction.open(Dialog.WechatLogin)
    }
  },


  render() {
    return (
      <BaseSearch
        placeholder="请输入股票代码或名称"
        result={this.state.result}
        onSearch = {this._onSearch}
        onChangeCallback = {this._changeCallback}
        onFocus={this.onFocus}
      />
    );
  }

});

module.exports = StockSearch;
