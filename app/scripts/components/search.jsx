"use strict"
/**
* 顶部搜索组建
*/
const React = require('react');
const Reflux = require('reflux');
const SearchStore = require('../stores/SearchStore');
const SearchActions = require('../actions/SearchActions');
const CommonModal = require('../model/commonModal');
const FilterModal = require('../model/filterModal');
const SelectSearch =require('./select-search');

export default class Search extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    result:[]
  }
  _onSearch =(val)=>{
      let strBeg = val.indexOf('(');
      let strEnd = val.indexOf(')');
      if (strBeg >1 && strEnd > 1) {
        let str = val.substring(parseInt(strBeg) + 1 ,parseInt(strEnd));
        this.props.searchKey(str,null);
      }
  }
  _changeCallback=(val)=>{
    CommonModal.onAutoGet(val,(data)=>{
      this.setState({
        result:data
      });
    });
  }
  handleFocus=()=>{
    this.props.handleFocus();
  }
  handleBlur =()=>{
    this.props.handleBlur();
  }
  render() {
    return (
      <SelectSearch
        placeholder="请输入股票代码或名称"
        result={this.state.result}
        onSearch = {this._onSearch}
        onChangeCallback = {this._changeCallback}
        handleFocus={this.handleFocus}
        handleBlur={this.handleBlur}
        />
    );
  }
}
//
// let Search = React.createClass({
//   getInitialState:function(){
//     return {
//       val:null,
//       key:null,
//     };
//   },
//   onStatusChange:function(val){
//     let _this = this;
//     this.setState({autoValue:val});
//   },
//   onInitializeItems: function(callback) {
//     // 初始化默认选项
//     callback(['foo1', 'food', 'bar']);
//   },
//   onPick: function(item) {
//     this.setState({val:item.value});
//     var self = this;
//     // 取出股票代码传给props
//     var strBeg = item.value.indexOf('(');
//     var strEnd = item.value.indexOf(')');
//     if (strBeg >1 && strEnd > 1) {
//       var str = item.value.substring(parseInt(strBeg) + 1 ,parseInt(strEnd));
//       FilterModal.getMerge(str,function(data,err){
//         if (data.events.length !=0) {
//           self.props.searchKey(str,data.events[0].event_id);
//         } else {
//           self.props.searchKey(str,null);
//         }
//       });
//     }
//   },
//   onSearch:function(value, callback){
//     CommonModal.onAutoGet(this.props.radiokey,value,function(data){
//       return callback(data);
//     });
//   },
//   componentDidMount: function() {
//   },
//   render: function() {
//     return (
//       <Autocomplete
//         onInitializeItems={this.onInitializeItems}
//         onPick={this.onPick}
//         placeholder={'请输入股票代码或名称'}
//         onSearch ={this.onSearch}
//         value={this.state.val}
//         />
//
//     );
//   }
// })
//
// module.exports = Search;
