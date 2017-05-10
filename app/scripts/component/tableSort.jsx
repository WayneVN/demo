import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import TallyModal from '../model/tallyModal';
import Fromat from '../util/format';
import numeral from 'numeral';
import _ from '_';
import Tooltip from 'rc-tooltip';
import RecordStatusActions from '../actions/RecordStatusActions';
var RecordStatusStore = require('../stores/RecordStatusStore');
var If = require('./if');

class TableSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colIndex:0,
      title_lack:[]
    };
    this.unStatus = RecordStatusStore.listen(this.onStatusChange);
  }
  onStatusChange = (obj) =>{
      if (obj && obj.data.title_lack) {
            this.setState({
                title_lack:obj.data.title_lack
            });
      }else {
            this.setState({
                title_lack:[]
            });
      }
  }
  componentWillUnmount() {
      this.unStatus();
  }
  _isColor(cell, row, rowIndex, columnIndex) {
    cell = parseFloat(new String(cell).replace(',', ""));
    if (numeral(_.isFinite(cell)?cell:0).format('0.00') <= 0) {
      return 'f-green';
    }
    return 'f-red';
  }
  _FormatHtml(cell, row) {
    return cell;
  }
  _FormatAddCommas(cell) {
    return Fromat.addCommas(numeral(cell).format('0'));
  }
  _FormatGujia(cell){
    return cell > 0 ? numeral(cell).format('0.00') : cell;
  }
  _FormatPrice(cell) {
    return cell;
  }
  _FormatterTitle(cell) {
    let strBeg = cell.indexOf('(');
    let strEnd = cell.indexOf(')');
    let str = '';
    if (strBeg > 1 && strEnd > 1) {
      str = cell.substring(parseInt(strBeg) + 1, parseInt(strEnd));
    }
    return cell;
  }
  _FormatUnit(cell) {
    cell = _.isFinite(cell) ? cell:0;
    return numeral(cell).format('0.0%');
  }
  mergeData() {
    const {props: {
        data
      }} = this;
    let group = this._findGroup();
    return this._mergeRow(group);
  }
  // 查找所有需要合并基金的数据
  _findGroup() {
    const {props: {
        data
      }} = this;
    let group = _.groupBy(data, 'parent_fund_id');
    group = _.omit(group, 'null');
    let allKey = _.keys(group);
    return {_keys: allKey, group: group};
  }
  // 多条数据合并为一条数据---得出所有需要合并的基金项目
  _mergeRow(rows) {
    let newRows = [];
    for (var i = 0; i < rows._keys.length; i++) {
      let newGroup = {
        stock: '',
        stock_num: '',
        stock_price: '',
        stock_id: '',
        parent_fund_id: ''
      };
      let _g = rows.group[rows._keys[i]];
      // 循环单个group内数据
      for (var j = 0; j < _g.length; j++) {
        newGroup.stock += `${this._FormatterTitle(_g[j].stock)}<br/>`;
        newGroup.stock_num += `${this._FormatAddCommas(_g[j].stock_num)}<br/>`
        newGroup.stock_price += `${this._FormatPrice(_g[j].stock_price)}<br/>`;
        newGroup.stock_id += `${_g[j].stock_id}<br/>`;
      }
      newGroup.stock_value = this._FormatAddCommas(_.sumBy(_g, 'stock_value'));
      newGroup.earn = this._FormatAddCommas(_.sumBy(_g, 'earn'));
      newGroup.buy = _.sumBy(_g, 'buy');
      // (公式推导：现收益率 ＝ 现盈利 ／ 买入成本； 昨收益率 ＝ 昨盈利 ／ 买入成本)
      let _earn_ratio = _.sumBy(_g, 'earn') / newGroup.buy;
      newGroup.earn_ratio = this._FormatUnit(_earn_ratio);
      newGroup.parent_fund_id = rows._keys[i];
      newRows.push(newGroup);
    }
    return this._mergeAllRows(newRows, rows._keys);
  }
  // 合并后的基金替换原有数据
  _mergeAllRows(newrows, _keys) {
    let data = _.clone(this.props.data);
    _keys = _keys || 0;
    for (var i = 0; i < _keys.length; i++) {
      data = _.remove(data, function(n) {
        return n.parent_fund_id != _keys[i];
      });
      let _new = _.findIndex(newrows, {'parent_fund_id': _keys[i]});
      data.push(newrows[_new]);
    }
    for (var j = 0; j < data.length; j++) {
      if (data[j].parent_fund_id == null) {
        // 将数据处理为int类型
        data[j].earn = new String(data[j].earn).replace(',', "");
        data[j].earn_ratio = this._FormatUnit(data[j].earn / data[j].buy);
        data[j].stock = this._FormatterTitle(data[j].stock);
        data[j].stock_price = this._FormatPrice(data[j].stock_price);
        data[j].stock_num = this._FormatAddCommas(data[j].stock_num);
        data[j].stock_value = this._FormatAddCommas(data[j].stock_value);
        data[j].earn = this._FormatAddCommas(data[j].earn);
      }
    }
    return data;
  }
  currentSort(a, b, order,colIndex) {
    if (this.state.colIndex !=colIndex) {
      this.setState({
        colIndex:colIndex
      });
    }
    return order == 'asc'
      ? parseFloat(a.stock_price) - parseFloat(b.stock_price)
      : parseFloat(b.stock_price) - parseFloat(a.stock_price);
  }
  parseSort(a, b, order, key,colIndex) {
    if (this.state.colIndex !=colIndex) {
      this.setState({
        colIndex:colIndex
      });
    }
    return order == 'asc'
      ? numeral(a[key]).format('0.000') - numeral(b[key]).format('0.000')
      : numeral(b[key]).format('0.000') - numeral(a[key]).format('0.000');
  }
  render() {
    var data = this.mergeData();
    let {state:{colIndex = 0,title_lack}} = this;
    let isShow = title_lack.some((v,i)=>{
        return 'amount' == v;
    });

    let canSort = data && data.length >1 ;

    return (
      <BootstrapTable data={data}>
        <TableHeaderColumn dataField="stock" width="350" isKey={true} dataFormat={this._FormatHtml}>
          股票名称
        </TableHeaderColumn>

        <TableHeaderColumn  dataField="stock_price" width="90" dataAlign="right" dataSort={canSort} sortFunc={(a,b,order)=>this.currentSort(a,b,order,1)} dataFormat={this._FormatGujia}>
          {this.props.headName}
          <If when ={canSort} >
            <i className={!data.length || colIndex==1?'hide':'fa fa-unsorted'}/>
          </If>

        </TableHeaderColumn>

        <TableHeaderColumn dataField="stock_num" width="100" dataSort={canSort} sortFunc={(a, b, order) => this.parseSort(a, b, order, 'stock_num',2)} dataAlign="right" dataFormat={this._FormatHtml}>
          持有量
          <If when ={canSort} >
            <i className={!data.length || colIndex==2?'hide':'fa fa-unsorted'}/>
          </If>
        </TableHeaderColumn>

        <TableHeaderColumn dataField="stock_value" width="150" dataSort={canSort} sortFunc={(a, b, order) => this.parseSort(a, b, order, 'stock_value',3)} dataFormat={this._FormatHtml} dataAlign="right">
          持有市值
          <If when ={canSort} >
            <i className={colIndex==3?'hide':'fa fa-unsorted'}/>
          </If>
        </TableHeaderColumn>

        <TableHeaderColumn dataField="earn" dataSort={canSort} sortFunc={(a, b, order) => this.parseSort(a, b, order, 'earn',4)} width="120" columnClassName={this._isColor} dataFormat={this._FormatHtml} dataAlign="right">
          盈利
          <If when ={canSort} >
            <i className={colIndex==4?'hide':'fa fa-unsorted'}/>
          </If>
          <Tooltip placement="left" overlay={<span>此处显示的个股盈亏不包含手续费</span>}>
              <img src="../../images/Symbol1.png" className={isShow?'cur-icon-sm':'hide'} alt="icon"/>
          </Tooltip>
        </TableHeaderColumn>

        <TableHeaderColumn dataAlign="right" dataField="earn_ratio" dataSort={canSort} sortFunc={(a, b, order) => this.parseSort(a, b, order, 'earn_ratio',5)} width="120" columnClassName={this._isColor} dataFormat={this._FormatHtml}>
          收益率
          <If when ={canSort} >
            <i className={colIndex==5?'hide':'fa fa-unsorted'}/>
          </If>
      <Tooltip placement="left" overlay={<span>此处显示的收益率不包含手续费</span>}>
              <img src="../../images/Symbol1.png" className={isShow?'cur-icon-sm':'hide'} alt="icon"/>
          </Tooltip>
        </TableHeaderColumn>

      </BootstrapTable>
    );
  }
}

module.exports = TableSort;
