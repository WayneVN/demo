"use strict";
/**
 * 春训营－pdf列表
 * @author chenmin@joudou.com
 */

const React = require('react');
const {Route, Link, RouteHandler} = require('react-router');
const SpringModel = require('../../model/summerModel');
const moment = require('moment');
const logger = require('../../util/logger');
const _ = require('_');

const List = React.createClass({
  getInitialState: function() {
    return {
      list: []
    }
  },

  componentDidMount: function () {
    logger.log({
      target: 'summer_list_page'
    });
    this._switch(this);
  },

  _switch: function(self) {
    const {
      props: {
        params: {
          type,                 // 根据type获取不同的接口
          id                    // _.find 需要用
        },
        userInfo: {
          user_id
        }
      }
    } = self;

    if(type == 'task') {
      this.taskList(user_id, id);
    }
    else {
      this.answerList(user_id, id);
    }
  },

  taskList: function(user_id, id) {
    SpringModel.jobQuestions(user_id, this.props.params.courseId, result => {
      const {
        status,
        data = []
      } = result;

      if(status) {
        this.filterData(data, id, 'question_file');
      }
    });
  },

  answerList: function(user_id, id) {
    SpringModel.jobAnswers(user_id, result => {
      const {
        status,
        data = []
      } = result;

      if(status) {
        this.filterData(data, id, 'file');
      }
    });
  },

  filterData: function(data, id, type) {
    let _list = {};
    if (data.length == 1) {
      _list = data[0];
    }
    else {
      _list = _.find(data, o => type == 'file'?
                     o.id == id :
                     o.job_id == id
                    );
    }

    let item = _list[type].split('|');
    let showList = [];
    for(let i = 0; i < item.length; i++) {
      showList.push(item[i].split('/')[2]);
    }
    showList = _.sortBy(showList, o => {
      return o.split('_')[0];
    });
    this.setState({
      list: showList
    });
  },

  componentWillReceiveProps: function (nextProps) {
    const {
      params: {
        type,                 // 根据type获取不同的接口
        id                    // _.find 需要用
      },
      userInfo: {
        user_id
      }
    } = nextProps;

    if(type == 'task') {
      this.taskList(user_id, id);
    }
    else {
      this.answerList(user_id, id);
    }
  },

  render: function() {
    let {
      state: {
        list
      }
    } = this;
    const {
      props: {
        params: {
          type,                 // 根据type获取不同的接口
          id                    // _.find 需要用
        }
      }
    } = this;

    return (
      <div>
        <div className="page-header">
          <h2>{ type == 'task'? '作业列表': '答案列表' }</h2>
        </div>
        <ul>
          {
            list.map((item,k) => {
              return <li key = {k}>
                <a href={`#/pdf/${ type }/${ item }`}
                     target="_blank">
                    {item.substring(11,item.length - 4)}
                  </a>
                </li>
            })
          }
        </ul>
      </div>
    )
  }
});

module.exports = List;
