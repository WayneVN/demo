"use strict";
const React = require('react');
const Reflux = require('reflux');
const ReactSlider = require('../../../node_modules/react-slider/react-slider');
const InternalStore = require('../stores/InternalStore');
const InternalActions = require('../actions/InternalActions');
const FilterSotre = require('../stores/FilterStore');
const FilterAction = require('../actions/FilterActions.js');
const _ = require('_');
const format = require('../util/format');
const numeral = require('numeral');
const SliderActions = require('../actions/SliderActions');
const SliderStore = require('../stores/SliderStore');
import If from './If';
import SliderBg from './slider';


const CheckSliderBar = React.createClass({
  mixins: [
    Reflux.connect(SliderStore, 'initData'),
    Reflux.listenTo(FilterSotre,'onChangeItem'),
    Reflux.listenTo(InternalStore,'onInternalItem'),
  ],

  getInitialState: function() {
    return {
      conditions:null,
      values: [ 0,0 ],//经过转换的value 只做显示
      _val:[0,99],//实际的value值
      defaultValue:[0,99],
      count: 1,
      defalutSelect:null,
      select:[],
      disabled:false,
      minMax:[],
      init:true
    };
  },

  onInternalItem: function(obj) {
    if (!obj) return;
    let list = [];
    if (obj._select) {
      for (var i = 0; i < obj._select.length; i++) {
        if (obj._select[i].key == this.props.dataName) {
          list = obj._select[i].range;
          this.setState({
            defaultValue:list,
          })
        } else {
          list = [0,99];
        }
      }
    } else {
      list = [0,99];
    }
    let values = this.parseVal(list);
    if (this.state.init) {
      this.setState({
        values:values,
        _val:list,
        init:false
      });
    }
  },

  onChangeItem: function(obj) {
    if (!obj) return;
    let list = [];
    if (obj._select && obj._select.hasOwnProperty(this.props.dataName)) {
      list = obj._select[this.props.dataName].range;
      this.setState({
        defaultValue:list
      })
    } else {
      list = [0,99];
    }
    let values = this.parseVal(list);
    if (obj.init) {
      this.setState({
        values:values,
        _val:list
      });
    }
  },

  parseVal: function(val) {
    let {dataName} = this.props;
    let {initData} = this.state;
    let valList =  [ parseInt(initData[dataName].x[val[0]]),parseInt(initData[dataName].x[val[1]])];
    return valList;
  },

  componentDidMount: function() {
    SliderActions.getInitRange();

    if ( this.props.page=='merger') {
      InternalActions.getAll();
    }
    else {
      FilterAction.getAllInit();
    }
  },

  handleReset: function() {
    this.setState({
      disabled: false
    });
  },

  // 拖动后改变球球
  handleChange: function(val) {
    this.setState({
      values: this.parseVal(val),
      _val:val
    });
  },

  onAfterChange: function(val) {
    this.changeValue(val);
  },

  changeValue:function(val){
    var select ={key:this.props.dataName,range:val};
    this.props.page == 'merger'?this.props.values(select):FilterAction.setSelect(select);
  },

  handleUpdate:function(list){
    this.setState({
      values: list
    });
    this.changeValue(list);
  },

  handleUpdateL: function(e) {
    var list = [e.target.value, this.state.values[1]];
    this.handleUpdate(list);
  },

  handleUpdateR: function(e) {
    var list = [this.state.values[0], e.target.value]
    this.handleUpdate(list);
  },

  componentWillReceiveProps:function(nextProps){
    if (nextProps.isReset)
        this.handleReset();
  },

  render: function() {
    let inputl = format.addCommas(this.state.values[0]);
    let inputr = format.addCommas(this.state.values[1]);
    return (
      <div className="panel-row">
        <p className="row-title">{this.props.name}</p>
          <SliderBg size="sm" dataName={this.props.dataName} data={this.state.initData} />
        <ReactSlider className="rc-slider horizontal-slider rc-slider-sm"
              defaultValue={this.state.defaultValue}
              handleActiveClassName="bar-active"
              onAfterChange={this.onAfterChange}
              onChange={this.handleChange}
              value={this.state._val}
              disabled={this.state.disabled}
              onSliderClick = {this._SliderClick}
              min= {0} max= {99}
              withBars={true}>
              <div className="num-handle">{inputl}</div>
              <div className="num-handle">{inputr}</div>
         </ReactSlider>
      </div>
    );
  }
});

module.exports = CheckSliderBar;
