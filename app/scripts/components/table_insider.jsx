import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Reflux from 'reflux';
import _ from '_';
import keyMap from '../util/keyMap';
import numeral from 'numeral';
import Format from '../util/format';
import If from './If';
import InternalListActons from '../actions/InternalListActions';

export default class TableInsider extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    thead: PropTypes.array
  }
  static defaultProps = {
    data: []
  }
  state = {
    thead:[],
    order:-1
  }
  filterData(props){
    let {data} =props;
    let event_map = {
      "0": "限制性股票激励",
      "1": "股票期权激励",
      "2": "大股东增持",
      "3": "公司回购",
      "4": "高管增持",
      "5": "员工持股计划",
      "6": "大股东减持",
      "7": "高管减持"
    };
    for (let i = 0; i < data.length; i++) {
      data[i].event_type_name = event_map[data[i].event_type];
      data[i].stock_price =numeral(data[i].stock_price).format('0.00');
      data[i].money =Format.myriadFormat(data[i].money);
      data[i].share_ratio =numeral(data[i].share_ratio).format('0.00%');
      data[i].publish_date =Format.stringDateFormat(data[i].publish_date);
    }
  }
  mergerActive(){
    let {thead} = this.props;
    let len = thead.length;
    let list = [];
    for (let i = 0; i < len; i++) {
      list.push({index:i,name:thead[i],clazz:'fa fa-sort'});
    }
    this.setState({thead:list});
  }
  // 改变排序icon方向
  activeClazz(key){
    let {thead:list} = this.state;
    let i = _.findLastIndex(list, {
      index: key
    });
    let isSort = false;
    switch (list[i].clazz) {
      case 'fa fa-sort':
        list[i].clazz = 'fa fa-sort-asc color-org';
        this.setState({order:1});
        break;
      case 'fa fa-sort-asc color-org':
        list[i].clazz = 'fa fa-sort-desc color-org';
        this.setState({order:-1});
        break;
      case 'fa fa-sort-desc color-org':
        list[i].clazz = 'fa fa-sort-asc color-org';
        this.setState({order:1});
        break;
    }
    this.setState({thead:list});
  }
  sortColum(sortKey,e) {
      this.activeClazz(sortKey);
      let {eid,sid} = this.props.params;
      InternalListActons.setSortKey(sortKey,this.state.order);
      InternalListActons.getData(eid,sid);
  }
  componentWillUpdate(np,ns){
    this.filterData(np);
  }
  componentWillMount () {
    this.mergerActive();
  }
  checkView(id,type,e){
    if (type==0 || type==1) {
      window.location.href = `/#/merger/${this.props.params.sid}/${id}/insider/detail`;
    }
  }
  render () {
    let {data:list,params} = this.props;
    return(
      <table className='table-base-list'>
        <thead>
          <tr>
            {this.state.thead.map((item,key)=>{
              return <td key={key} onClick={this.sortColum.bind(this,item.index)}>
                        {item.name}
                        <If when={key!=0}>
                          <i className={item.clazz}></i>
                        </If>
                      </td>
            })}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((item,key)=>{
            let clazz = item.event_type==0||item.event_type==1?'':'disabled';
            let _clazz = params.eid == item.event_id ?
                  `${clazz} ${ item.event_type==6 || item.event_type==7 ? 'active-green' : 'active-red' } ` :
                  clazz;
              return <tr key={key}
                        onClick={this.checkView.bind(this,item.event_id,item.event_type)}
                        className={_clazz}>
                        <td >
                          <a href="javascript:;" className="table-link">{item.event_type_name}</a>
                        </td>
                        <td >
                          <a href="javascript:;" className="table-link">{item.stock_price==0?'-':item.stock_price}</a>
                        </td>
                        <td >
                          <a href="javascript:;" className="table-link">{parseFloat(item.money)==0?'-':item.money}</a>
                        </td>
                        <td >
                          <a href="javascript:;" className="table-link">{parseFloat(item.share_ratio)==0?'-':item.share_ratio}</a>
                        </td>
                        <td >
                          <a href="javascript:;" className="table-link">{item.people_num==0 ?'-':item.people_num}</a>
                        </td>
                        <td >
                          <a href="javascript:;" className="table-link">{item.publish_date}</a>
                        </td>
                     </tr>
          })}
        </tbody>
      </table>
    );
  }
}
