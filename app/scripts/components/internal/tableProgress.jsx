/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "内部交易二级页面通用表格"
 */

"use strict"
import React, {
  Component
} from 'react';
import _ from '_';
const Progress = require('./progress');
import numeral from 'numeral';
const Format = require('../../util/format');
import If from '../If';

const TableProgress = React.createClass({

  getDefaultProps: function() {
    return {
      thead: '',
      thead: [],
      titem: [],
      type: ''
    };
  },

  getInitialState: function() {
    return {
      activeList: {}
    }
  },

  /* 记录哪些行被展开了*/
  open: function(k) {
    let {
      state: {
        activeList
      }
    } = this;

    activeList[k] = true;
    this.setState({activeList});
  },

  hide: function(k) {
    let {
      state: {
        activeList
      }
    } = this;

    activeList[k] = false;
    this.setState({activeList});
  },

  href: function(eid) {
    const {
      props: {
        type,
        sid
      }
    } = this;

    if (type == 'motivation') {
      window.location.href = `/#/merger/${sid}/${eid}/insider/detail`;
    }
  },

  render: function() {
    const {
      props: {
        ttitle,
        thead,
        type,
        titem = []
      }
    } = this;
    let {
      state: {
        activeList = []
      }
    } = this;


    return (
      <div className="table-progress">
        <h3 className="table-title">
          <span className="table-title-text fwn">
            {ttitle}
          </span>
        </h3>
        <ul className="table-thead">
          {
            thead.map((item,k) => {
              return <li key={k}>{item}</li>
            })
          }
        </ul>

        <ul className="table-tbody">
          {
            titem.map((item,k) => {
              return <li className={`${type == 'motivation' ?'curp':''} ${item.parent_item.statusClass}`}
                         key={k}
                         onClick={e => {this.href(item.parent_item.event_id)}}
                     >
          <ul className="table-tr">
            <li>
              <i className={ activeList[k]?'fa fa-minus' :item.parent_item.icon }
                 onClick={ e => {  activeList[k]?this.hide(k):this.open(k) } }
              />
              {item.parent_item.timeFirst}
            </li>
            <li style={{fontSize: item.parent_item.event_type == 0?12:''}}>
              {item.parent_item.tr1}
            </li>
            <li>
              {item.parent_item.tr2}
            </li>
            <li>
              {
                item.parent_item.amount > 0?
                Format.moneyIntFormatw(item.parent_item.amount,1) :
                '-'
              }
            </li>
            <li>
              {
                item.parent_item.share_ratio == 0?
                '-':
                item.parent_item.share_ratios
              }
            </li>
            <li>
              {
                item.parent_item.cost == 0 ?
                '-':
                item.parent_item.cost
              }
            </li>
            <li className={item.parent_item.tr3Class}>
              {/* {item.parent_item.tr3} */}
            </li>
            <li>
              <If when={type != 'motivation'}>
                <Progress
                    now= {item.parent_item.progress}
                    color={item.parent_item.status}
                    parentData={item.parent_item.progress}
                    type={item.parent_item.event_type}
                />
              </If>
              <If when={type == 'motivation'}>
                <span style={{color:'#999'}}>{numeral(item.parent_item.progress).format('0.0%')}</span>
              </If>
            </li>
            <li>
              {item.parent_item.timeLast}
            </li>
            <li className={item.parent_item.typeClass}>
              {item.parent_item.statusName}
            </li>
            <li className={`table-sub-item animated ${activeList[k]? 'fadeInDown': 'hide'}` }>
              {
                item.sub_item.map((_item, _k) => {
                  return<ul className="table-tr">
                    <li className="table-sub-item-first fll">
                      {_item.timeFirst}
                    </li>
                    <li style={{fontSize: _item.event_type == 0?12:''}}>
                      {_item.tr1}
                    </li>
                    <li>
                      {_item.tr2}
                    </li>
                    <li>
                      {
                        _item.amount > 0?
                        Format.moneyIntFormatw(_item.amount,1) :
                        '-'
                      }
                    </li>
                    <li>
                      {_item.share_ratios}
                    </li>
                    <li>
                      {_item.cost}
                    </li>
                    <li className={_item.tr3Class}>
                      {/* {_item.tr3} */}
                    </li>
                    <li>
                      <Progress
                          now= {_item.progress}
                          sub= {true}
                          subData ={item.sub_item}
                          parentData ={item.parent_item.progress}
                          index={_k}
                          type={_item.event_type}
                      />
                    </li>
                    <li>
                      {_item.timeLast}
                    </li>
                    <li></li>
                  </ul>
                })
              }
            </li>
          </ul>
              </li>
            })
          }
        </ul>
      </div>
    );
  }

});

module.exports = TableProgress;
