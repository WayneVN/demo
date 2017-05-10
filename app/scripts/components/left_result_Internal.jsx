"use strict";
/**
 *   左边菜单筛选－－结果
 */
const React = require('react');
const Reflux = require('reflux');
const Link = require('react-router').Link;
const InternalTabStore = require('../stores/InternalTabStore');
const InternalTabActions = require('../actions/InternalTabActions');
const _ = require('_');
import keyMap from '../util/keyMap';

const LeftResultInternal = React.createClass({
  mixins: [Reflux.connectFilter(InternalTabStore, 'resultList', function(data) {
      let {events} = data;
      //event_type id 中文映射
      let event_map = new keyMap();
      for (let i = 0; i < events.length; i++) {
        events[i].event_type_name = event_map[events[i].event_type];
      }
      return data;
    })],
  getInitialState: function() {
    return {
      resultList: {
        events:[]
      }
    };
  },
  componentDidMount:function(){
    InternalTabActions.initQuery();
  },
  render: function() {
    return (
      <div className="panel-sm">
        <div className="panel-head">
          <p>选股结果</p>
        </div>
        <div className="panel-body">
          <table className="panel-list-sm">
            <tbody>
              {this.state.resultList.events.map((item, key) => {
                  return <tr key= {key}>
                          <td className="list-item-name">
                            <Link to={`/merger/${item.stock_id}/${item.event_id}/insider`}>{item.stock_name}</Link>
                          </td>
                          <td>
                            <span className={item.event_type==6 || item.event_type==7?'tip-lg tip-green':'tip-lg tip-red'} >
                              {item.event_type_name}
                            </span>
                          </td>
                        </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = LeftResultInternal;
