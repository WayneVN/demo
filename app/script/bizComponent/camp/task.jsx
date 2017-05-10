/**
 * 夏令营－每期作业
 * @author chenmin@joudou.com
 */

"use strict";
const React = require('react');
const SpringModel = require('../../model/summerModel');
const moment = require('moment');
const ListPagination = require('./listPagination');
const _ = require('_');
var If = require('../../component/if');
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);


const Task = React.createClass({
  getInitialState: function() {
    return {
      fileList: {
        file_list: []
      },
      tableList: [],
      isRender: true,
      pageData: [],
      isBack: false,
      imgUri: '',
      title: ''
    }
  },

  componentDidMount: function () {
    this.getQuestions();
  },

  alertMsg: function (type, title, msg) {
    this.refs.alert[type](
      title,
      msg, {
        timeOut: 5000,
        extendedTimeOut: 1000
      });
  },

  // 获取作业列表
  getQuestions: function () {
    const {
      props: {
        data: {
          uid
        }
      }
    } = this;

    SpringModel.jobQuestions(uid, this.props.courseId, result => {
      const {
        status,
        data = []
      } = result;

      this.setState({
        tableList: data
      });
    });
  },

  filterData: function(data, id, cb) {
    let _list = {};
    if (data.length == 1) {
      _list = data[0];
    }
    else {
      _list = _.find(data, o =>  o.job_id == id );
    }
    if(_list['question_file'].length == 0) {
      this.alertMsg('error','无法查看','对不起，您没有权限查看，是否该期作业未交？')
      return ;
    }

    let item = _list['question_file'].split('|');
    let showList = [];
    for(let i = 0; i < item.length; i++) {
      showList.push(item[i].split('/')[2]);
    }
    showList = _.sortBy(showList, o => {
      return o.split('_')[0];
    });
    this.setState({
      pageData: showList,
      title: _.find(data, o => o.job_id ==id).job_title,
    }, () => {
      return cb(showList);
    });
  },

  renderTable: function() {
    let {
      state: {
        tableList = []
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
                    <td>{
                        moment(item.upload_time * 1000).format('YYYY/MM/DD HH:mm')
                        }</td>
                      <td>{item.job_title}</td>
                        <td>
                            <span onClick= {event => {this.showDetail(item.job_id)}}
                                 className="jd-btn jd-btn-orange"
                                 >
                                查看
                            </span>
                            &nbsp;
                            <a href={item.help_file?`camp/jobfiles/${this.props.courseId}${item.help_file}`:'javascript:;'}
                               target="_blank"
                               className={`jd-btn ${item.help_file?'jd-btn-orange':'jd-btn-gray'}`}
                            >
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
        imgUri:`camp/jobfiles/${this.props.courseId}/jobs/${ showList[0] }`
      });
    });
  },

  checkStatus: function() {
    this.setState({
      isBack: !this.state.isBack,
    });
  },

  renderDetail: function() {
    return (
      <img alt="" src={this.state.imgUri}/>
    );
  },

  renderUrl: function(uri) {
    this.setState({
      imgUri: `camp/jobfiles/${this.props.courseId}/jobs/${ uri }`
    });
  },

  render: function() {
    let {
      state: {
        tableList,
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
            <a href="javascript:;" onClick={event => {this.setState({isBack: false})}}>作业列表</a>
            <If when={isBack}>
              <small>&nbsp;>&nbsp;{title}&nbsp;</small>
            </If>
            <If when={isBack}>
              <a href="javascript:;" onClick={event => {this.checkStatus()}}>
                <i className="fa fa-reply flr"  />
              </a>
            </If>
          </h2>
        </div>
        <If when={isBack}>
          <ListPagination
             data= {pageData}
             renderUrl = {this.renderUrl}
             type="task"
          />
        </If>
        {
          isBack ? this.renderDetail() :this.renderTable()
        }
      </div>
    )
  }
});

module.exports = Task;
