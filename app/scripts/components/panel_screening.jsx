"use strict";
/**
 * 个股筛选－筛选面板
 */

const React = require('react');
const CheckBox = require('./checkbox');
const CheckSlider = require('./check_slider');
const Reflux = require('reflux');
const FilterSotre = require('../stores/FilterStore');
const FilterActions = require('../actions/FilterActions');
const MergerSelectActions = require('../actions/MergerSelectActions');
const MergerSelectStore = require('../stores/MergerSelectStore');
const SliderActions = require('../actions/SliderActions');

const PanelScreen = React.createClass({
  mixins: [
    Reflux.connect(MergerSelectStore,'select')
  ],
  getInitialState:function(){
    return {
      select:null,//筛选条件
      reset:false,
      isopen:false,
      list:null
    };
  },
  componentDidMount:function(){
    // 初始化拖动条范围
    SliderActions.getInitRange();
    FilterActions.getAllInit();
  },
  handleOpen:function(){
    this.setState({isopen:!this.state.isopen});
  },
  handleReset:function(){
    // window.location.reload();
    this.setState({
      reset:true
    });
    FilterActions.initRange();
  },
  render: function() {
    return (
      <div className="panel fadeIn animated">
        <div className="panel-head">
          <p>筛选条件</p>
          <a href="javascript:;" className="link-res" onClick={this.handleReset}>重新筛选</a>
        </div>
        <div className="panel-body" style={{paddingTop:1,paddingBottom:1}}>
          <span className={"panel-telescopic-close".concat(this.state.isopen?' link-active':'') } onClick={this.handleOpen} >展开</span>
          <span className={"panel-telescopic-open".concat(this.state.isopen?'':' link-active') } onClick={this.handleOpen} >收起</span>
          <table className="list-where-bg-lg">
            <thead>
              <tr>
                <td>指标</td>
                <td>最小值</td>
                <td>个股分布</td>
                <td>最大值</td>
                <td>计数</td>
                <td></td>
              </tr>
            </thead>
             <tbody className={!this.state.isopen?'':'isDisabled'}>
              <CheckSlider name="test"  dataName='test' isReset={this.state.reset} showTr={true} />
              <CheckSlider name="股价"  dataName='stock_price' isReset={this.state.reset} />
              <CheckSlider name="市盈率"  dataName='pe' isReset={this.state.reset} />
              <CheckSlider name="业绩年增速%"  dataName='year_growth' isReset={this.state.reset} />
              <CheckSlider name="市净率"   dataName='pb' isReset={this.state.reset} />
              <CheckSlider name="市值/亿"    dataName='market_value' isReset={this.state.reset}  />
              <CheckSlider name="营业收入/亿"   dataName='revenue' isReset={this.state.reset}  />
              <CheckSlider name="当季业绩增速%"   dataName='season_growth' isReset={this.state.reset} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = PanelScreen;
