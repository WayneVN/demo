
var React = require('react');
var pageEnum = require('../../../util/pageEnum');
var If = require('../../../component/if');
var MergerModal = require('../../../model/mergerModal').default;
var LoginActions = require('../../../actions/LoginActions');
var AlertActions = require('../../../actions/AlertActions');
var numeral = require('numeral');

var UCScopt = React.createClass({

  getInitialState() {
    return{
      userScope: this.props.userScope,
    }
  },

  transfer: function (params) {
    this.props.transfer({
      page: pageEnum.userAccount[params]
    });
  },

  render() {
    return(
      <div className="uc-panel-body">
        <div className="uc-left-menu">
          <ul className="uc-nav">
            <li className="uc-left-active" >我的积分</li>
            <li onClick={() => {this.transfer('doumi')}}>我的竞猜</li>
            <li onClick={() => {this.transfer('lottery')}}>我的奖品</li>
            <li onClick= {() => this.transfer('setting')}>喜好设置</li>
          </ul>
        </div>

        <div className="uc-right-content">
          {this.renderScope()}
        </div>
      </div>
    )
  },

  renderScope() {
    let {
      available,
      sum_doumi,
      total_num =1 ,//总人数
      accumulative_login_ranking = 0.01,
      succesive_login_ranking = 0.01,
      browse_page_ranking = 0.01,
      self_stock_addition_ranking = 0.01,
      upload_transaction_record_ranking = 0.01,
      valid_feedback_ranking = 0.01,
      friend_recommendation_ranking = 0.01,
      sum_ranking = 0.01,
      accumulative_login_times,
      succesive_login_times,
      browse_page_times,
      self_stock_addition_times,
      upload_transaction_record_times,
      valid_feedback_times,
      friend_recommendation_times,
      doumi_from_lottery
    } = this.state.userScope;


    return(<div className="scope">
      <div className="uc-row">
        剩余<span className="big-num">{available}</span> 斗<img src="/images/mi.svg" className="mi"/>
      </div>
      <div className="uc-row">
        <table className="uc-scope-table">
          <tr>
            <th>规则详情</th>
            <th>统计</th>
            {/*<th>排名</th>*/}
          </tr>

          <tr>
            <td>每登录1天 <span className="num">+10</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td>{accumulative_login_times}天</td>
            {/*<td>打败 <span className="num">{numeral(accumulative_login_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>每连续登录1天 <span className="num">+15</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td>{succesive_login_times}天</td>
            {/*<td>打败 <span className="num">{numeral(succesive_login_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>每浏览1个页面 <span className="num">+2</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td>{browse_page_times}个</td>
            {/*<td>打败 <span className="num">{numeral(browse_page_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>每添加1个自选股 <span className="num">+5</span>斗<img src="/images/mi.svg" className="mi mt-10"/> <span className="temp">(暂不增加)</span></td>
            <td>{self_stock_addition_times}个</td>
            {/*<td>打败 <span className="num">{numeral(self_stock_addition_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>每上传1份交易记录 <span className="num">+20</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td>{upload_transaction_record_times}份</td>
            {/*<td>打败 <span className="num">{numeral(upload_transaction_record_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>每提出一次有效反馈 <span className="num">+20</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td>{valid_feedback_times}次</td>
            {/*<td>打败 <span className="num">{numeral(valid_feedback_ranking).format('0%')}</span>人</td>*/}
          </tr>
          <tr>
            <td>累计抽奖获得斗米 <span className="num">+{doumi_from_lottery}</span>斗<img src="/images/mi.svg" className="mi mt-10"/> </td>
            <td></td>
          </tr>
        </table>
      </div>

      <div className="uc-row mt-30 total-line">
        累计获得 <span className="num">{sum_doumi}</span>斗<img src="/images/mi.svg" className="mi"/>
        {/*<span className="ml40">用户排名打败</span>
       <sapn className="big-num">{numeral(sum_ranking).format('0%')}</sapn>人*/}
      </div>

      <div className="uc-row mt-10 color-blue">
        敬请期待
      </div>

      <div className="uc-row mt-20">
        <table className="uc-scope-table">
          <tr>
            <td>成功推荐1个好友 +100斗<img src="/images/mi-gray.svg" className="mi mt-10"/> </td>
            <td>0个</td>
            {/*<td>打败 1% 人</td>*/}
          </tr>
          </table>
      </div>

    </div>)
  },

});

module.exports = UCScopt;
