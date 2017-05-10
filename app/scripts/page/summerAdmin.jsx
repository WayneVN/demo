/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "夏令营－后台"
 */


"use strict";
const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');;
const SummerModel = require('../model/summerModel');
const Reflux = require('reflux');
const _  = require('lodash');
const ReloadStore = require('../stores/ReloadStore');
const UserInfo = require('../util/userInfo');
import MergerModal from '../model/mergerModal';
const Model = new MergerModal();
import If from '../components/If';

const AdminPage = React.createClass({
  mixins: [Reflux.connectFilter(ReloadStore, 'reload', function(data) {
    if (data){
      Model.userinfo((data) => {
        UserInfo.set(data);
        if(data.status) {
          this.getData();
        }
      });
    }
    else {
      window.location.reload();
    }

    return data;
  }) ],

  getInitialState: function() {
    return {
      userInfo: {},
      reload: true,
      isStatus: false,
      data: {},
      isAdmin: false,
      manager: [],
      selectVal: 10,
      loading: false
    }
  },

  componentDidMount: function() {
    // 判断管理员权限
    this.getData();

  },

  componentWillReceiveProps: function(nextProps) {
    //this.getData();
  },

  getData: function() {
    let {
      data: {
        user_id
      }
    } = UserInfo.get();

    SummerModel.studentsUserInfo(user_id, result => {
      let {
        status = false,
        data: {
          manager
        }
      } = result;
      let is = _.find(manager, ['role_type', 0]); //判断是否为管理员

      this.setState({
        data: result.data,
        manager: manager,
        selectVal: manager.length ? manager[0].course_id: 6,
        isAdmin: is,
        loading: true
      });
    });
  },

  changeSelect: function(e) {
    this.setState({
      selectVal: e.target.value,
      reload: false,
    }, () => {
      this.setState({
        reload: true
      });
    });
  },

  render: function() {
    let {
      state: {
        isStatus,
        isAdmin,
        userInfo,
        loading,
        reload
      }
    } = this;
    if (!loading) {
      return (
        <noscript />
      )
    }
    const MAPS = {
      1: '2016春训营',
      2: '2016夏令营',
      3: '2016秋训营(经典版)',
      4: '2016秋训营(升级版)',
      5: '2016冬令营金数版',
      6: '2016冬令营九斗数据版',
      7: '2017春训营经典版',
      8: '2017春训营升级版',
      9: '2017春训营聚源版',
      10: '2017春训营choice版'
    };

    return (
      <div className="container bn" >
        <aside className="tally-nav">
          <If when={isAdmin}>
            <ul className="nav-menu">
              <li className="pure-menu-selected">
                <Link to='/campsAdmin/taskList' activeClassName="activeLink" >
                  <i className="fa fa-tasks" />每期作业
                  </Link>
              </li>
              <li className="pure-menu-selected">
                <Link to='/campsAdmin/answerlist' activeClassName="activeLink" >
                  <i className="fa fa-th-list" />发布答案
                  </Link>
              </li>
              <li className="pure-menu-selected">
                <Link to='/campsAdmin/userlist' activeClassName="activeLink" >
                  <i className="fa fa-user" />用户列表
                  </Link>
              </li>
            </ul>
           </If>
          </aside>
          <div className="tally-right-container">
            <div className="tally-content">
              <select onChange={this.changeSelect}
                      defaultValue={this.state.manager[0].course_id || '1'}
                      defaultvalue={this.state.manager[0].course_id || '1'}
              >
                {
                  this.state.manager.map((item, keys) => {
                    return item.role_type != 2 ?(
                      <option value={item.course_id}>{MAPS[item.course_id]}</option>
                    ): (
                      <noscript />
                    )
                  })
                }
              </select>
              {
                reload?(<RouteHandler {...this.state}/>):( <noscript />)
              }
            </div>
          </div>
      </div>
    );
  }
});

module.exports = AdminPage;
