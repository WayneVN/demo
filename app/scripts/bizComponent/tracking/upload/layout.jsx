/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－layout－上传流水页面"
 */
"use strict";
const React = require('react');
const Reflux = require('reflux');
import Router, {RouteHandler, Link} from 'react-router';
const UploadRecord = require('./uploadRecord');//上传流水页面－进度条
const UploadWarp = require('./uploadWarp'); // 上传流水页面－上传
const UploadStatus = require('./uploadStatus'); //文件状态
const EditTable = require('./table'); //文件状态
const TrackingModel = require('../../../model/trackingModel');
const _ = require('_');
const If = require('../../../component/if');
const Breadcrumb = require('../../../component/breadcrumb');
const Loading = require('../../../component/loading');
const moment = require('moment');
const numeral = require('numeral');
const logger = require('../../../util/logger');


const Layout = React.createClass({
  getInitialState() {
    return {
      addItem: null,
      total: 50,
      tableData: [],
      lastData: [],
      first: true, //是否为首次上传，判定条件为空文件
      statusData: [], //文件上传状态
      isloading: false
    };
  },

  componentDidMount() {
    logger.log({
      target: 'page_account_detail'
    });
    this.getUploadsHistoryData();
  },

  // 所有文件上传状态
  getUploadsHistoryData() {
    TrackingModel.getUploadsHistory(result => {
      let {
        data = [],
        status = false
      } = result;
      if (status) {
        if (data.length == 0) {
          this.setState({
            first: true,
          });
        }
        else {
          this.setState({
            first: false,
            tableData: [],
            statusData: data
          },() => {
            this.getStRecordsData();
          });
        }
      }
    });
  },

  // 获取标准化流水
  getStRecordsData() {
    TrackingModel.getStRecords( (result) => {
      let {
        data = [],
        status = false,
        page_num = 1,
        page_size = 50,
        total = 50
      } = result;
      const _rows = data.map((item,key) => {
        item.date = moment(item.date,'YYYYMMDD').format('YYYY/MM/DD');
        item.price = numeral(item.price).format('0.00');
        item.num = numeral(item.num).format('0,0');
        item.amount = numeral(item.amount).format('0,0');
        item.balance = numeral(item.balance).format('0,0');
        return item;
      });
      this.setState({
        tableData: _rows,
        total: total,
      });
    });
  },

  // 查询最新一次文件上传状态
  getUploadsLatest() {
    TrackingModel.getUploadsLatest(result => {
      let {
        is_finished = false,
        status = false
      } = result;

      if (status) {
        this.setState({
          first: false
        });
        if (!is_finished) {
          setTimeout(()=>{
            this.getUploadsLatest();
          }, 1000);
        }
        else {
          this.setState({
            isloading: false
          }, () => {
            this.getUploadsHistoryData();
          });
        }
      }
    });
  },

  popItem(item) {
    if (!item) {
      this.getUploadsLatest();
    }
    this.setState({
      addItem: item,
      isloading: true
    });
  },

  clearData() {
    if (confirm('您确认要清空你的所有数据？')) {
      TrackingModel.clearData(data => {
        this.getUploadsHistoryData();
        this.setState({
          tableData: []
        });
      });
    }
  },

  /* 文件上传完毕，开始轮训文件状态*/
  fileCallback() {
    this.getUploadsLatest();
  },

  render() {
    let {
      state: {
        addItem,
        tableData,
        first,
        statusData,
        lastData,
        total,
        isloading
      }
    } = this;
    let uri = [
      {
        name: '交易追踪',
        path: '#/account/report',
        target: ''
      },
      {
        name: '上传流水',
        path: '#/account/upload',
        target: ''
      }
    ];

    return (
      <div className="container-bg bn">
        {/* <Breadcrumb  uri={uri}/> */}

        <UploadWarp
            popItem = {this.popItem}
            fileCallback = {this.fileCallback}
            dataItem = {tableData}
        />

        <If when={!first}>
          <div className="t-panel">
            <div className="t-panel-head">
              <p className="t-panel-title">
                文件处理
                <a href="javascript:;"
                   className="t-panel-btn"
                   onClick={this.clearData}
                >
                  清空
                </a>
              </p>
            </div>
            <div className="t-panel-body">
              <UploadStatus
                  addItem ={addItem}
                  statusData = {statusData}
                  lastData = {lastData}
              />
            </div>
          </div>
        </If>


        <div className="t-panel mb10">
          <div className="t-panel-head">
            <p className="t-panel-title">
              股票统计
            </p>
          </div>
          <div className="t-panel-body">
            <div className="t-table-warp" >
              <If when={isloading}>
                <div className="t-table-mark" />
              </If>
              <If when={isloading}>
                <Loading />
              </If>
              <EditTable
                  rows = {tableData}
                  total = {total}
              />
            </div>
          </div>
        </div>



      </div>
    )
  }
});

module.exports = Layout;
