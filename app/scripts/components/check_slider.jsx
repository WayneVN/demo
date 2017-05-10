"use strict";
const React = require('react');
const Reflux = require('reflux');
const CheckBox = require('./checkbox');
const ReactSlider = require('../../../node_modules/react-slider/react-slider');
const FilterSotre = require('../stores/FilterStore');
const FilterAction = require('../actions/FilterActions.js');
const InternalStore = require('../stores/InternalStore');
const InternalActions = require('../actions/InternalActions');
const MergerSelectStore = require('../stores/MergerSelectStore');
const SliderActions = require('../actions/SliderActions');
const SliderStore = require('../stores/SliderStore');
const format = require('../util/format');
const numeral = require('numeral');
const _ = require('_');
import If from './If';
import SliderBg from './slider';

const keys ={
  ENTER_KEY : 13,
  ESC_KEY : 27,
};


const CheckSlider = React.createClass({
  mixins: [
    Reflux.connect(SliderStore, 'initData'),
    Reflux.listenTo(InternalStore, 'onInternalItem'),
    Reflux.listenTo(FilterSotre, 'onFilterItem'),
  ],

  getDefaultProps: function() {
    return {
      // 是否显示禁用按钮
      showDis: true,
      showTr:false
    };
  },

  getInitialState: function() {
    return {
      conditions: [],
      values: [ 0,0 ],
      _val:[0,99],
      count: 1,
      defalutSelect: null,
      select: [],
      disabled: false,
      minMax: [],
      initData: {},
      checkL:true,
      checkR:true,
      checkLval:0,
      checkRval:0
    };
  },

  onInternalItem: function(obj) {
    if (!obj) return;
    let parmas;
    this.setState({conditions: obj.range_conditions});
    try {
      for(var i = 0; i < obj.range_conditions.length; i++) {
        if (obj.range_conditions[i].key == this.props.dataName) {
          parmas = {
            count: obj.range_conditions[i].count
          };
        }
      }
      this.setState({
        count: parmas.count,
        values:obj.init?this.parseVal([0,99]):this.state.values
      });
    } catch (e) {}
  },

  onFilterItem: function(obj) {
    if (!obj) return;
    let parmas;
    let list = [];
    this.setState({conditions: obj.conditions});
    try {
      for(var i = 0; i < obj.conditions.length; i++) {
        if (obj.conditions[i].key == this.props.dataName) {
          parmas = {
            count: obj.conditions[i].count
          };
        }
      }
      this.setState({
        count: parmas.count,
        values:obj.init?this.parseVal([0,99]):this.state.values
      });
    } catch (e) {}
  },

  componentDidMount: function() {
    FilterAction.clearData();
    // InternalStore 读取并购重组 , FilterAction:读取个股筛选
    this.props.page == 'merger'
      ? InternalActions.getAll()
      : FilterAction.getAll();
  },

  handleReset: function() {
    this.setState({
      disabled: false,
      _val:[0,99]
    });
  },

  _SliderClick: function(val) {
    var list = this.state.values;
    if (isNaN(val)) {
      this.setState({
        values: list,
        _val:val
      });
    }
  },

  // 拖动后改变输入框
  handleChange: function(val) {
    this.setState({
      values: this.parseVal(val),
      _val:val
    });
  },

  onAfterChange: function(val) {
    this.changeValue(val);
  },

  // 解析数组
  parseVal:function(val){
    let {dataName} = this.props;
    let {initData} = this.state;
    let valList =  [ parseInt(initData[dataName].x[val[0]]),parseInt(initData[dataName].x[val[1]])];
    return valList;
  },

  // 解析单个值
  parseSlige:function(val){
    let {dataName} = this.props;
    let {initData} = this.state;
    return initData[dataName].x[val];
  },

  // 反向取，用vlaue取下标
  parseReverse:function(val){
    let {dataName} = this.props;
    let {initData} = this.state;
    let {length} =initData[dataName].x;
    let Xdata = initData[dataName].x;
    let Stop = false;
    let index =0;
    for (let i = 0; i < length; i++) {
      // 取该vlaue所在的下标
      if (Xdata[i] == val &&!Stop) {
        index = i;
        Stop = true;
      }
    }
    for (let i = 0; i < length; i++) {
      if (Xdata[i-1]<= val && Xdata[i+1] >=val && !Stop){ //如果去不到，就取和他最相近的上一个值
          index = i;
        Stop = true;
      }
    }
    // 返回真实下标
    return  index;
  },

  // 改变值之后调用store
  changeValue: function(val) {
    let {checkLval,checkRval} = this.state;
    let showVal = [];
    if (checkLval>0) {
      showVal=[checkLval,this.state.values[1]];
    }
    if (checkRval>0) {
      showVal=[this.state.values[0],checkRval];
    }
    var select = {
      key: this.props.dataName,
      range:val,
      showVal:showVal
    };
    this.setState({
      _val:val
    });
    this.props.page == 'merger'
      ? this.props.values(select)
      : FilterAction.setSelect(select) ;
  },

  changeCount: function() {
    // 根据当前这个父组件传递下来的参数，进行改变计数器
    var k = this.props.dataName;
    var _count = this.props.select[k.concat('_num')];
    this.setState({count: _count});
  },

  handleUpdate: function(list) {
    this.setState({values: list});
    this.changeValue(list);
  },

  handleDisabled: function() {
    this.setState({
      disabled: !this.state.disabled
    });
    FilterAction.removeSelect(this.props.dataName);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.isReset)
      this.handleReset();
  },

  checkInput:function(e){
    this.setState({checkL:false},function(){
      this.refs.inputLeft.getDOMNode().focus();
    });
  },

  checkInputR:function(e){
    this.setState({checkR:false},function(){
      this.refs.inputRight.getDOMNode().focus();
    });
  },

  changeLeftVal:function(e){
    this.setState({checkLval:e.target.value});
  },

  changeRightVal:function(e){
    this.setState({checkRval:e.target.value});
  },

  onKey:function(e){
    let {keyCode} = e;
    if (e.keyCode == keys.ENTER_KEY) {
      this.changeInputValLeft(e);
    }
  },

  onKeyR:function(e){
    let {keyCode} = e;
    if (e.keyCode == keys.ENTER_KEY) {
      this.changeInputValRight(e);
    }
  },

  changeInputValLeft:function(e){
    let values = [];
    let parseObj = this.valLegal(e.target.value);
    let _val =[];
    if (parseObj.status) {
      values =[e.target.value,this.state.values[1]];
      _val =[parseObj.val,this.state._val[1]];
      this.setState({
        values:values,
        checkL:true,
        _val:_val
      });
      this.changeValue(_val);
    } else  {
      alert('您输入的信息有误，请重新输入！');
    }
  },

  changeInputValRight:function(e){
    let values = [];
    let parseObj = this.valLegal(e.target.value);
    let _val =[];
    if (parseObj.status) {
      values =[this.state.values[0],e.target.value];
      _val =[this.state._val[0],parseObj.val];
      this.setState({
        values:values,
        checkR:true,
        _val:_val
      });
      this.changeValue(_val);
    } else  {
      alert('您输入的信息有误，请重新输入！');
    }
  },

  blurInputl:function(e){
    this.changeInputValLeft(e);
  },

  blurInputr:function(e){
    this.changeInputValRight(e);
  },

  // 验证输入的value的合法性
  valLegal:function(val){
    if (_.isNumber(parseInt(val))  ) {
      let {dataName} = this.props;
      let {initData} = this.state;
      let min =  initData[dataName].x[0];
      let max =  initData[dataName].x[initData[dataName].x.length-1];
      if (val>=min && val<=max) {
        return  {
          val:this.parseReverse(val),
          status:true
        };
      }
    }
    return {status:false};
  },

  render: function() {
    var cx = React.addons.classSet;
    var show,
      hide;
    var classes = cx({
      'row-disabled': this.state.disabled,
      'animated': true,
      'row-display': this.props.isShow,
      'row-none-dis': !this.props.showDis
    });
    var classes_border = cx({
      'row-disabled': this.state.disabled,
      'animated': true,
      'row-display': this.props.isShow,
      'row-none-dis': !this.props.showDis,
      'row-border': true
    });
    let inputl = format.addCommas(this.state.values[0]);
    let inputr = format.addCommas(this.state.values[1]);
    return this.props.showTr?(<div></div>): (
      <div>
        <tr className={classes_border}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <If when={this.props.showDis}>
            <td></td>
          </If>
        </tr>
        <tr className={classes}>
          <td className="list-title">
            {this.props.name}
          </td>
          <td className="list-num">
            <If when={this.state.checkL}>
              <input className="input-default" onChange={this.handleUpdateL} ref="inputL" type="button" value={inputl} onClick={this.checkInput} disabled={this.state.disabled} />
            </If>
            <If when={!this.state.checkL}>
              <input className="input-default"
                type="text"
                ref="inputLeft"
                onBlur={this.blurInputl}
                defaultValue={this.state.values[0]}
                onKeyDown={this.onKey}
                disabled={this.state.disabled}
                required
              />
            </If>
          </td>
          <td className="list-btn">
            <SliderBg dataName={this.props.dataName} data={this.state.initData}/>
              <ReactSlider className="rc-slider horizontal-slider"
                 defaultValue={[0,99]}
                 value={this.state._val}
                 handleActiveClassName="bar-active"
                 onAfterChange={this.onAfterChange}
                 onChange={this.handleChange}
                 disabled={this.state.disabled}
                 onSliderClick= {this._SliderClick}
                 withBars={true}
                 min= {0}
                 max= {99}
               />
          </td>
          <td className="list-num">
            <If when={this.state.checkR}>
              <input className="input-default" onChange={this.handleUpdateR} ref="inputR" type="button" value={inputr} onClick={this.checkInputR} disabled={this.state.disabled}/>
            </If>
            <If when={!this.state.checkR}>
              <input className="input-default"
                type="text"
                ref="inputRight"
                onBlur={this.blurInputr}
                defaultValue={this.state.values[1]}
                onKeyDown={this.onKeyR}
                disabled={this.state.disabled}
                required
              />
            </If>
          </td>
          <td className="list-num">
            <div className="num-warp ">
              <span className="count">{this.state.count}</span>
            </div>
          </td>
          <If when={this.props.showDis}>
            {/*禁用按钮*/}
            <td>
              <a href="javascript:;" onClick={this.handleDisabled}>
                <i className={`fa fa-minus-circle ${this.state.disabled?'color-org':' color-grey'}`}></i>
              </a>
            </td>
          </If>
        </tr>

      </div>
    );
  }
});

module.exports = CheckSlider;
