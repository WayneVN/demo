/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "交易诊断－head"
 */

const React = require('react');
const _ = require('_');
const DiagnosedModel = require('../../../model/diagnosedModel');
const DialogAction = require('../../../actions/dialogAction');
const Dialog = DialogAction.Dialog;
const moment = require('moment');

const ReportHead = React.createClass({
  getInitialState() {
    return {
      list: [],
      drop: false,
      selectInfo: true
    };
  },

  componentDidMount() {
    DiagnosedModel.getEvents(result => {
      if (result.status) {
        this.setState({
          list: result.data
        });
      }
    });
  },

  open() {
    DialogAction.open(Dialog.Card);
  },

  isDrop() {
    this.setState({
      drop: !this.state.drop,
      selectInfo: !!(this.state.list.length)
    }, () => {
      setTimeout(() => {
        this.setState({
          selectInfo: true
        });
      }, 5000);
    });
  },

  _switch(obj) {
      this.props._switch(obj);
  },

  render() {
    let {
      state: {
        drop,
        list,
        selectInfo
      }
    } = this;

    return (
      <div className="container-report-head">
        <ul className="report-head-title">
          <li className="report-head-logo fll">
            <i className="iconfont icon-jiudou9"></i>
          </li>
          <li>
            <ul className="report-head-list fll">
              <li className="report-head-item-title">
                交易诊断
              </li>
              <li>
              </li>
            </ul>
          </li>
        </ul>

        <a
            className="btn btn-orange btn-report-update flr"
            href="javascript:;"
            style={{
              zIndex: 1
            }}
            onClick={this.open}
        >
          立即诊断
        </a>

        <a
            className="btn btn-orange btn-report-update flr por"
            href="javascript:;"
            onClick={this.isDrop}
        >
          我的诊断&nbsp;
          <i className="fa fa-caret-down" />
          <div className={`btn-dropbox ${drop || 'hide'}`}>
            {
              list.map((item, k) => {
                return (
                  <div className="item"
                       key={k}
                       onClick={
                         () => {
                           this._switch(item)
                         }
                               }
                  >
                    {item.title}
                  </div>
                )
              })
            }
          </div>
        </a>
        <p className="dia-select-info">
          {selectInfo || '*暂无报告,请立即诊断'}
        </p>

      </div>
    )
  }
});

module.exports = ReportHead;
