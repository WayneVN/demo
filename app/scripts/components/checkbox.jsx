"use strict"
var React = require('react');
var Reflux = require('reflux');
var CheckActions = require('../actions/CheckActions');
var CheckStore = require('../stores/CheckStore');
var InternalCheckStore = require('../stores/InternalCheckStore');

var Checkbox = React.createClass({
  mixins: [
    Reflux.listenTo(CheckStore,'onChangeCount'),//并购重组内的btn
    Reflux.listenTo(InternalCheckStore,'onInternalCount'),//内部交易的btn
  ],
  propTypes:{
    isReset:React.PropTypes.bool,
    checkItem:React.PropTypes.array,
  },
  // 通过store 动态改变计数器
  onChangeCount:function(data){
    if (!data) return ;
    var self = this;
    for (var i = 0; i < data.set_conditions.length; i++) {
      if (data.set_conditions[i].key == this.props.dataName) {
        self.setState({count:data.set_conditions[i].count});
      }
    }
  },
  //内部交易的btn
  onInternalCount:function(data){
    if (!data) return ;
    var self = this;
    for (var i = 0; i < data.length; i++) {
      if (data[i].key == this.props.dataName) {
        self.setState({count:data[i].count});
      }
    }
  },
  getDefaultProps:function(){
    return {
      istitle:true,
    };
  },
  getInitialState:function(){
    var list = [];
    for (var i = 0; i < this.props.checkItem.length; i++) {
      i== 0?list.push({name:this.props.checkItem[i],clazz:true}):list.push({name:this.props.checkItem[i],clazz:false});
    }
    return {
      name:this.props.name,
      checkItem:list,
      leftBtn:false,
      count:0,
      isReset:this.props.isReset
    };
  },
  componentDidMount:function(){
    // this.ReturnVal();
    // this.props.initVal(this.state.checkItem,this.props.dataName);
    // console.log(const { props: {  } } = this);
  },
  handleCheck:function(index){
    return function(){
      var obj = this.state.checkItem;
      if (index==0) {
        // 选择全部的情况下，所有按钮重置 同时通知store
        this.handleReset();
        return ;
      } else {
        obj[0].clazz = false;
      }
      if (this.props.type == 'radio') {
        for (var i = 0; i < obj.length; i++) {
          obj[i].clazz=false;
          // if (index == i && obj[i].clazz==true) {

          // }
        }
      }
      obj[index].clazz = !obj[index].clazz;
      var countClazz = 0;
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].clazz) {
          countClazz++;
        }
      }
      // 全部置空后，默认选择全部 [0]
      if (countClazz == 0) {
        this.handleReset();
        return ;
      }
      this.setState({checkItem:obj},function(){
        this.ReturnVal();
      });
    }.bind(this);
  },
  handleReset:function(){
    var self = this;
    var obj = [];
    for (var i = 0; i < this.state.checkItem.length; i++) {
      obj.push({name:this.state.checkItem[i].name,clazz:false});
    }
    obj[0].clazz=true;//将按钮重置为全部
    this.setState({checkItem:obj},function(){
      this.ReturnVal();
    });
  },
  componentWillReceiveProps:function(nextProps){
    if (nextProps.isReset)
      this.handleReset();
  },
  // 返回选中项
  ReturnVal:function(){
    this.props.returnVal(this.state.checkItem,this.props.dataName);
  },
  render: function() {
    var self = this;
    // var elm =
    return !this.props.simple ? (
        <div>
            <tr className="row-border">
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td className="list-title">
                  {this.state.name}
                </td>
                <td className="list-btn" colSpan={this.props.isCol?'3':''}>
                  {
                    this.state.checkItem.map(function(item,i) {
                    return <span className={ item.clazz?'jd-btn  jd-btn-small mr10 jd-active':'jd-btn jd-btn-small mr10'} key={i} onClick={self.handleCheck(i)}>{item.name}</span>;
                    })
                  }
                </td>
                <td className="list-num">
                  <div className="num-warp" ><span className="count">{this.state.count}</span></div>
                </td>
            </tr>
      </div>
    ):(
      <tr>
        <td className="list-btn" colSpan={this.props.isCol?'3':''}>
          {
            this.state.checkItem.map(function(item,i) {
            return <span className={ item.clazz?'jd-btn jd-btn-small mr10 jd-active':'jd-btn jd-btn-small mr10'} key={i} onClick={self.handleCheck(i)}>{item.name}</span>;
            })
          }
        </td>
      </tr>
    );
  }
});

module.exports = Checkbox;
