/**
 * 春训营－我的帐户
 * @author chenmin@joudou.com
 */
'use strict';

const React = require('react');
const SpringModel = require('../../model/summerModel');
const logger = require('../../util/logger');
const moment = require('moment');
const ListPagination = require('./listPagination');
const _ = require('_');
var If = require('../../component/if');
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const Answer = React.createClass({
  getInitialState: function() {
    return {
      tableList: [],
      status: false,
      isRender: true,
      pageData: [],
      isBack: false,
      imgUri: '',
      title: ''
    }
  },

  componentDidMount: function () {
    logger.log({
      target: 'summer_answer_page'
    });
    this.getAnswer();
  },


  filterData: function(data, id, cb) {
    let _list = {};
    if (data.length == 1) {
      _list = data[0];
    }
    else {
      _list = _.find(data, o =>  o.id == id );
    }
    if(_list['file'].length == 0) {
      this.alertMsg('error',
                    '对不起，您没有权限查看',
                    '无法查看');
      return ;
    }

    let item = _list['file'].split('|');
    let showList = [];
    for(let i = 0; i < item.length; i++) {
      showList.push(item[i].split('/')[2]);
    }
    showList = _.sortBy(showList, o => {
      return o.split('_')[0];
    });
    this.setState({
      pageData: showList,
      title: _.find(data, o => o.id ==id).title,
    }, () => {
      return cb(showList);
    });
  },

  // 获取答案
  getAnswer: function () {
    const {
      props: {
        data: {
          uid
        }
      }
    } = this;

    SpringModel.jobAnswers(uid, this.props.courseId, result => {
      const {
        status,
        data = []
      } = result;

      this.setState({
        tableList: data
      });
    });
  },

  renderTable: function() {
    let {
      state: {
        tableList
      }
    } = this;

    return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>序号</th>
              <th>时间</th>
              <th>作业</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {
              tableList.map((item,k) => {
                return <tr key={k} >
                  <td>{k+1}</td>
                    <td>{moment(item.upload_time * 1000).format('YYYY/MM/DD HH:mm')}</td>
                    <td>{item.title}</td>
                      <td>
                            <span onClick= {event => {this.showDetail(item.id)}}
                                 className="jd-btn jd-btn-orange"
                                 >
                                查看
                            </span>
                            &nbsp;
                            <a href={item.help_file?`/camp/jobfiles/${this.props.courseId}${item.help_file}`:'javascript:;'}
                               target="_blank" className={`jd-btn
                               ${item.help_file?'jd-btn-orange':'jd-btn-gray'}`}>
                               辅助文件下载</a>
                        </td>
                  </tr>
              })
            }
          </tbody>
        </table>
    );
  },

    // 切换到详情图片
  showDetail: function(id) {
    this.filterData(this.state.tableList, id, (showList) => {
      this.setState({
        isBack: !this.state.isBack,
        imgUri:`camp/jobfiles/${this.props.courseId}/answers/${ showList[0] }`
      });
    });
  },

  checkStatus: function() {
    this.setState({
      isBack: !this.state.isBack,
    });
  },

  alertMsg: function (type, title, msg) {
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  renderDetail: function() {
    return (
      <img alt="" src={this.state.imgUri}/>
    );
  },

  renderUrl: function(uri) {
    this.setState({
      imgUri: `camp/jobfiles/${this.props.courseId}/answers/${ uri }`
    });
  },

  render: function () {
    let {
      state: {
        tableList = [],
        isBack,
        pageData,
        title
      }
    } = this;

    return (
      <div>
        <ToastContainer
           ref="alert"
           toastMessageFactory={ToastMessageFactory}
           className="toast-top-right"
           />
        <div className="page-header">
          <h2>
            <a href="javascript:;" onClick={event => {this.setState({isBack: false})}}>
              训练营答案列表
            </a>
            <If when={isBack}>
              <small>&nbsp;>&nbsp;{title}&nbsp;</small>
            </If>
            <If when={isBack}>
              <a href="javascript:;" onClick={event => {this.checkStatus()}}>
                <i className="fa fa-reply flr" />
              </a>
            </If>
          </h2>
        </div>
        <If when={isBack}>
          <ListPagination
             data= {pageData}
             renderUrl = {this.renderUrl}
             type='answer'
             />
        </If>
        {
          isBack ? this.renderDetail() :this.renderTable()
        }
      </div>
    );
  }
});

module.exports = Answer;
