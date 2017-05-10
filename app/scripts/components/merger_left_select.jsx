"use strict";
/**
 * 左侧按钮选择面板-并购重组
 */
var React = require('react');
var Link = require('react-router').Link;
var ReactSlider = require('../../../node_modules/react-slider/react-slider');
var CheckSliderBar = require('./check_slider_bar');
var CheckPanel =require('./check_panel');
var InternalActions = require('../actions/InternalActions');
var _ = require('_');


var MergerLeftSelect = React.createClass({
  getInitialState: function() {
    return {
      reset: false,
      sliderCache:[],
      checkCache:[],
    };
  },

  componentWillMount: function() {
  },

  handleChange: function(val) {
    this.setState({values:val});
  },

  // 存储筛选条的筛选结果
  getValues: function(values, name) {
    var list ={};
    var sliderCache = this.state.sliderCache;
    for (var i = 0; i < sliderCache.length; i++) {
      if (sliderCache[i].key == values.key) {
        sliderCache[i] = values;
        list = values;
      }
    }
    if (_.isEmpty(list)) {
      sliderCache.push(values);
    }
    this.setState({sliderCache: sliderCache});
  },

  // 按钮点击后的callback
  returnVal: function(checkList, dataName) {
    var list =[];
    var checkCache = this.state.checkCache;
    for (var i = 0; i < checkList.length; i++) {
      if (checkList[i].clazz) {
        list.push(i);
      }
    }
    if (checkCache.length<3) {
      checkCache.push({key:dataName,val:list});
    }
    for (var i = 0; i < checkCache.length; i++) {
      if (checkCache[i].key == dataName) {
        checkCache[i] ={key:dataName,val:list};
      }
    }
    this.setState({checkCache:checkCache});
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.state != nextState ) {
      InternalActions.changeSelect(nextState.sliderCache,nextState.checkCache);
    }
  },

  render: function() {

    return (
      <div className="panel-sm">
        <div className="panel-head">
          <p>筛选条件</p>
          <a className="link-res" href="/#/msg/merger">重新筛选</a>
        </div>
        <div className="panel-body">
          <div className="panel-row">
            <CheckSliderBar name="复牌至今涨幅%" page="merger" values={this.getValues} dataName='resumption' />
          </div>
          <div className="panel-row">
            <CheckSliderBar name="合并后市盈率" page="merger" values={this.getValues} dataName='merged_pe'  />
          </div>
          <div className="panel-row">
            <CheckSliderBar name="承诺业绩增速%" page="merger" values={this.getValues} dataName='commitment_growth' />
          </div>
          <CheckPanel name="并购进程" dataName="process" checkItem={['全部','预案/草案','股东大会','证监会审核','并购完成']} returnVal={this.returnVal}/>
          <CheckPanel name="并购类型" dataName="merge_type" checkItem={['全部','借壳上市','现金收购']} returnVal={this.returnVal}/>
          <CheckPanel name="行业关系" dataName="industry_rel" checkItem={['全部','同行业收购','跨行业收购']} returnVal={this.returnVal}/>
        </div>
      </div>
    );
  }
});

module.exports = MergerLeftSelect;
