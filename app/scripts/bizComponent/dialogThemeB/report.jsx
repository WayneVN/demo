"use strict"
/**
 *投资报告
 *
 **/

var React = require('react');
var ReportActions = require('../../actions/ReportActions');
var ReportModal = require('../../model/reportModal').default;
var BookModal = require('../../model/bookModal');
var numeral = require('numeral');
var $ = require('jquery');
var If = require('../../component/if');
var Pie = require('../../component/chartSinglePie').default;
var Format = require('../../util/format');
var Loading = require('../../component/loading');
var AlertActions = require('../../actions/AlertActions');
var DialogThemeB = require('../../component/dialogThemeB');

var Report = React.createClass({

  getInitialState() {
    let sub_id ="";
    BookModal.getSubId(subId => sub_id = subId);
    return({
      data: {},
      loading: true,
      SampleData: false,
      sub_id: sub_id,
    });
  },

  componentWillMount() {
    this.getData();
  },

  getData(){

    ReportModal.userReport(this.state.sub_id,(data)=>{
      if (!isNaN(data.data["2D"])&&!isNaN(data.data["2E"])&&data.data["2D"]&&data.data["2E"]) {
        this.dataFilter(data.data);
      }else {
        this.setState({
          loading:false
        },()=>{
          AlertActions.error(
            '缺失数据或数据计算异常' ,
            '数据异常', {
              timeOut: 5000,
              extendedTimeOut: 1000
            });
        });
      }

    });
    // "data": {
    // "1A": 282, 您上传的交易日
    // "1B": 100,总共交易了87次
    // "1C": 180,买卖的股票有
    // "2A": 54108,您的总资产额
    // "2B": 48045.666015625, 投入资金
    // "2C": -3602, 累计盈利
    // "2D": -0.0041652750558173,累计收益率
    // "2E": 0, 同期大盘涨跌幅-3.2%
    // "3A": 0.72408416935035,最后仓位
    // "3B": 0.83027953955955,平均仓位
    // "4A": -0.0053879168773231,平均复利收益率 (计算)
    // "5A": 100,
    // "5B": 0.00011563784163846,
    // "5C": -0.02776235424764,
    // "user_id": 157
  },

  dataFilter(data){
    let resultCommit = '';
    let day = 0;
    let everDay = 0;
    let itemCommit = '';
    let heli = ''
    data['2D'] = parseFloat(data['2D'],10);
    data['2E'] = parseFloat(data['2E'],10);
    data['5B'] = parseFloat(data['5B'],10);
    if (data['2D'] > 0 && data['2D'] >= data['2E']) {
      resultCommit ='股神，我们做朋友吧';
    }

    if (data['2D'] < data['2E']) {
      resultCommit ='考虑买ETF可好';
    }

    if (!data['2D'] && data['2D'] > data['2E']) {
      resultCommit = '避险成功';
    }

    if (data['2D'] <= 0 && data['2D'] >= data['2E']) {
      resultCommit='没赚钱，不赖你';
    }

    if ((data['1A']/data['1B'])>1) {
      day = (data['1A']/data['1B']);
      if (day%1>0) {
        day = numeral(day).format('0.0');
      }
    }
    if ((data['1A']/data['1B'])<1) {
      everDay = (data['1B']/data['1A']);
    }
    if (data['4A']>0.2) {
      itemCommit='保持10年，你就是巴菲特';
    }
    if (data['4A']>0.1 && data['4A']<0.2) {
      itemCommit='赢了P2P';
    }
    if (data['4A']>0.03 && data['4A']<0.1) {
      itemCommit='赢了余额宝';
    }
    if (data['4A']>=0.02 && data['4A']<=0.03) {
      itemCommit='逼近余额宝';
    }
    if (data['4A']<0.02) {
      itemCommit='不如存银行';
    }
    let imageUrl = '../../images/qc.png';
    if (data['3B']>=0.9) {
      imageUrl = '../../images/mc.png';
    }
    if (data['3B']<=0.9 && data['3B']>=0.65) {
      imageUrl = '../../images/zc.png';
    }
    if (data['3B']<=0.65 && data['3B']>0.4) {
      imageUrl = '../../images/bc.png';
    }
    if (data['3B']<=0.4) {
      imageUrl = '../../images/qc.png';
    }

    if ((data['5B']*100)<1) {
      heli = '../../images/hl.png';
    }
    if ((data['5B']*100)>1&&(data['5B']*100)<3) {
      heli = '../../images/pg.png';
    }
    if ((data['5B']*100)>3) {
      heli = '../../images/ssz.png';
    }
    let resultObj = {};
    let obj ={
      '2Dunit':parseFloat(data['2D'])>0?'+':'-',
      bannerClazz:parseFloat(data['2D'])>0?'r-banner-title':'r-banner-title-green',
      '2D':parseFloat(data['2D'])>0?numeral(data['2D']).format('0.0%'):numeral(data['2D']*-1).format('0.0%'),
      '2A':parseInt(data['2A'])>=10000 || parseInt(data['2A'])<=-10000?Format.moneyFormat(parseInt(data['2A'])):Format.addCommas(parseInt(data['2A'])),
      '2B':parseInt(data['2B'])>=10000 || parseInt(data['2B'])<=-10000?Format.moneyFormat(parseInt(data['2B'])):Format.addCommas(parseInt(data['2B'])),
      '2C':parseInt(data['2C'])>=10000 || parseInt(data['2C'])<=-10000?Format.moneyFormat(parseInt(data['2C'])):Format.addCommas(parseInt(data['2C'])),
      '2Eunit':parseFloat(data['2E'])>0?'big-red-font':'big-green-font',
      '2E':numeral(data['2E']).format('0.00%'),
      '2Cunit':parseFloat(data['2C'])>0?'big-red-font':'big-green-font',
      '_2Cunit':parseFloat(data['2C'])>0?'r-info-list-r':'r-info-list-r-green',
      'resultCommit':resultCommit,
      day:day,
      everDay:everDay,
      '4A':numeral(data['4A']).format('0.00%'),
      itemCommit:itemCommit,
      '5A':parseInt(data['5A'])>=10000?Format.moneyFormat(parseInt(data['5A'])):numeral(data['5A']).format('0'),
      '5B':numeral(data['5B']).format('0.00%'),
      '5C':numeral(data['5C']).format('0.00%'),
      imageUrl:imageUrl,
      heli:heli,
    }
    $.extend(true,resultObj,data,obj);
    this.setState({
      SampleData: data.SampleData,
      data:resultObj,
      loading:false
    });
  },

  render(){

    let {data, loading} = this.state;

    if(loading){
      return(
      <DialogThemeB>
        <DialogThemeB.Body className="modal-body report-body">
            <Loading />
          </DialogThemeB.Body>
        </DialogThemeB>
      )
    }

    let inputMoney = parseInt(data['2B'].toString().replace("万",""));//投入资本
    let netCapital = parseInt(data['2A'].toString().replace("万",""));//净资产
    return (
      <DialogThemeB>
        <DialogThemeB.Body className="modal-body report-body">
          <div className="report-panel">
            <div className="r-panel-head ">
              <If when={!data.sampleData} >
                <h3 className="r-title">投资分析报告</h3>
              </If>
              <If when={data.sampleData} >
                <h3 className="r-title">报告示例</h3>
              </If>
            </div>
            <div className="r-banner">
              <div className={data.bannerClazz}>
                <div className="r-banner-l">
                  <span className="r-banner-after-lg">
                    {data['2Dunit']}
                  </span>
                  <span className="r-banner-lg-num">
                    {data['2D']}
                  </span>
                  <span className="r-banner-font">
                    累计收益率
                  </span>
                </div>
                <div className="r-banner-r">
                  <ul className="r-banner-list-title">
                    <li>投资周期</li>
                    <If when={inputMoney >= 0}>
                      <li>投入资本增加</li>
                    </If>
                    <If when={inputMoney < 0}>
                      <li>投入资本减少</li>
                    </If>
                    <If when={netCapital >= 0}>
                      <li>净资产增加</li>
                    </If>
                    <If when={netCapital < 0}>
                      <li>净资产减少</li>
                    </If>
                  </ul>
                  <ul className="r-banner-list-detail">
                    <li>
                      {data['1A']}
                      <span style={{fontSize:12}}>
                        天
                      </span>
                    </li>
                    <li>
                      {/*
                       <span className="r-banner-after-md">+</span>
                       */}
                      {data['2B']}
                      <span style={{fontSize:12}}>
                        元
                      </span>
                    </li>
                    <li>
                      {data['2A']}
                      <span style={{fontSize:12}}>
                        元
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="r-banner-info">
                <ul className="r-banner-info-list">
                  <li className="r-info-list-l">
                    同期大盘涨跌幅
                    <span className={data['2Eunit']}>{data['2E']}</span>
                  </li>
                  <li className={data['_2Cunit']}>
                    累计盈亏
                    <span className={data['2Cunit']}>
                      {data['2C']}
                    </span> 元
                  </li>
                </ul>
                <p className="r-banner-commit">
                  "{data['resultCommit']}"
                </p>
                <i className="arr-l" />
                <i className="arr-r" />
              </div>
            </div>
            <div className="r-body">
              <div className="r-item">
                <ul className="r-transaction-list">
                  <li><span className="round" />
                    <If when={data.day != 0 && data['1B']}>
                      <div>
                        平均每{numeral(data.day).format('0')}天交易
                        <span className="lg-font">
                          <span className="num-font">
                            1
                          </span>
                          次
                        </span>
                      </div>
                    </If>
                    <If when={data.everDay != 0 && data['1B']}>
                      <div>
                        平均每天交易
                        <span className="lg-font">
                          <span className="num-font">
                            {numeral(data.everDay).format('0')}
                          </span>
                          次
                        </span>
                      </div>
                    </If>

                    <If when={!data['1B']}>
                      <div>
                        投资周期
                        <span className="lg-font">
                          <span className="num-font">
                            {numeral(data['1A']).format('0')}
                          </span>
                          天
                        </span>
                      </div>
                    </If>
                  </li>
                  <li className="r-list-center"><span className="round" />
                    总共交易了
                    <span className="lg-font">
                      <span className="num-font">
                        {data['1B']}
                      </span>
                      次
                    </span>
                  </li>
                  <li><span className="round" />
                    买卖的股票有
                    <span className="lg-font">
                      <span className="num-font">
                        {data['1C']}
                      </span>
                      只
                    </span>
                  </li>
                </ul>
                <div className="r-item-l">
                  <Pie data={data['3A']} name="最后仓位"/>
                </div>
                <div className="r-item-c">
                  <If when={!data.sampleData}>
                  <img src={data.imageUrl} className="r-cw" />
                  </If>
                  <If when={data.sampleData}>
                    <p className="r-cw sampleData">示例</p>
                  </If>
                </div>
                <div className="r-item-r">
                  <Pie data={data['3B']} name="平均仓位"/>
                </div>
              </div>

              <div className="r-item">
                <div className="r-item-l">
                  <ul className="r-item-l-ul">
                    <li className="r-first-item">{data['4A']}</li>
                    <li>平均复利收益率</li>
                  </ul>
                </div>
                <div className="r-item-c">
                  <ul className="r-banner-list-title">
                    <li>同期p2p</li>
                    <li>同期余额宝利率</li>
                    <li>同期银行利率</li>
                  </ul>
                  <ul className="r-banner-list-detail">
                    <li>10.0%</li>
                    <li>3.0% </li>
                    <li>2.0% </li>
                  </ul>
                </div>
                <div className="r-item-r">
                  <p className="r-item-r-info" style={{lineHeight:data.itemCommit=='保持10年，你就是巴菲特'?'26px':'90px'}}>
                    {data.itemCommit}
                  </p>
                </div>
              </div>



              <div className="r-item no-border">
                <div className="r-item-l">
                  <ul className="r-item-l-ul">
                    <li className="r-first-item">{data['5A']}元</li>
                    <li>累计交易费用</li>
                  </ul>
                </div>
                <div className="r-item-c">
                  <ul className="r-banner-list-title">
                    <li>占总成交金额的</li>
                    <li>占总体盈亏的</li>
                  </ul>
                  <ul className="r-banner-list-detail">
                    <li>{data['5B']}</li>
                    <li>{data['5C']}</li>
                  </ul>
                </div>
                <div className="r-item-r">
                  <img src={data.heli} className="item-icon"  />
                </div>
              </div>

            </div>
          </div>
        </DialogThemeB.Body>
        <If when={data.sampleData} >
          <div className="report-mask"></div>
        </If>
      </DialogThemeB>
    );
  }

});

module.exports = Report;

