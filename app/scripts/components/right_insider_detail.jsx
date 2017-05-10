"use strict";

/**
 * 内部交易 二级页面
 */

const React = require('react');
const Link = require('react-router').Link;
import Progress from './progress_insider';
import InternalModal from '../model/internalModal';
const numeral = require('numeral');
import ChartDoubleBar from './ChartDoubleBar';
import If from './If';
import Converter from './public/converter';

var RightInsiderDetail = React.createClass({
  getInitialState:function(){
    return {
      baseInfo:{},
      commitment:{},
      procedure:{}
    };
  },

  viewBack:function(){
    let {sid,eid} = this.props.params;
    window.location.href =`/#/merger/${sid}/${eid}/insider/list`;
  },

  getBaseInfo:function(id){
    InternalModal.getBaseInfo(id,data=>{
      this.setState({baseInfo:data});
    });
  },

  getCommitment:function(id){
    InternalModal.getCommitment(id,data=>{
      this.setState({commitment:data});
    });
  },

  getProcedure:function(id){
    InternalModal.getProcedure(id,data=>{
      this.setState({procedure:data});
    });
  },

  componentWillMount: function() {
    let {eid,sid} = this.props.params;
    this.getProcedure(eid);
    this.getBaseInfo(eid);
    this.getCommitment(eid);
  },

  render: function() {
    let {
      state: {
        baseInfo,
        commitment = {},
        procedure
      }
    } = this;

    let isNetIncome = commitment.value_type == 'net_income';

    return (
      <div className="container">
        <div className="panel-right animated fadeInRight">

          <div className="panel-content">
            <div className="panel-head">
              <h2>
                {procedure.is_vip=='0'?'':<span className="is_vip" >[重大]</span>}
                <Converter dataStr={`${procedure.stock_name}(${procedure.stock_id})
            发布${procedure.event_type=='0'?"限制性股票激励":"股票期权激励"}，占股比
            ${numeral(procedure.share_ratio).format('0.00%')}`} _type="link" />
              </h2>
              <i className="fa fa-reply back" onClick={this.viewBack}></i>
            </div>
            <div className="panel-body">
              <Progress time={procedure.procedure} />
              <div className="panel-chart">
                <div className="panel-head">
                  <p>
                    <span className="crile-l"></span>
                    基本信息
                    <span className="crile-r"></span>
                  </p>
                </div>
                <div className="panel-body">
                  <div className="base-info-defalut base-info-first">
                    <p>授予价格</p>
                    <div className="base-info-hr"></div>
                    <p>{numeral(baseInfo.grant_price).format('0.00')}元</p>
                  </div>
                  <div className="base-info-blue">
                    <p>现价</p>
                    <div className="base-info-hr"></div>
                    <p>{numeral(baseInfo.cur_price).format('0.00')}元</p>
                  </div>
                  <div className="base-info-org">
                    <p>PE</p>
                    <div className="base-info-hr"></div>
                    <p>{numeral(baseInfo.pe).format('0.0')}</p>
                  </div>
                  <div className="base-info-defalut">
                    <p>
                      {isNetIncome? '净利预期增速' : '营收预期增速'}
                    </p>
                    <div className="base-info-hr"></div>
                    <p>{numeral(commitment.increase_ratio).format('0.00%')}</p>
                  </div>
                </div>
              </div>

              <div className="panel-chart">
                <div className="panel-head">
                  <p>
                    <span className="crile-l"></span>
                    解锁条件
                    <span className="crile-r"></span>
                  </p>
                </div>
                <div className="panel-body">
                  <If when={isNetIncome}>
                    <ul className="chart-title">
                      <li><span className="blue"></span><p>实际净利润</p></li>
                      <li><span className="org"></span><p>解锁净利润</p></li>
                    </ul>
                  </If>
                  <If when={!isNetIncome}>
                    <ul className="chart-title">
                      <li><span className="blue"></span><p>实际营收</p></li>
                      <li><span className="org"></span><p>解锁营收</p></li>
                    </ul>
                  </If>
                  <ChartDoubleBar data={commitment} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RightInsiderDetail;
