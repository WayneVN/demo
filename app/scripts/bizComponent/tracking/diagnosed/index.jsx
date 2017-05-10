/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "记账－诊断流水"
 */

const React = require('react');
const DiagnosedModel = require('../../../model/diagnosedModel');
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);
const Head = require('./head');
const PdfContent = require('./pdfContent')
const numeral = require('numeral');
const If = require('../../../component/if');
const logger = require('../../../util/logger');
const _ = require('lodash');

const Index = React.createClass({
  getInitialState() {
    return {
      pdfContent: {}
    };
  },

  componentDidMount() {
    logger.log({
      target: 'page_diagnosed'
    });

    DiagnosedModel.getEvents(result => {
      let {
        status,
        data
      } = result;

      if (data.length) {
        let item = _.last(data);
        const statusMap = {
          1: {
            des: '',
            type: ''
          },
          500: {
            des: '诊断已完成!',
            type: 'success'
          }
        };
        if (item.status==500) {
          this.setState({
            pdfContent: item
          }, () => {
            if (item.exposed != 1) {
              this.refs.alert[statusMap[item.status].type](
                statusMap[item.status].des,
                '状态',
                {
                  timeOut: 5000,
                  extendedTimeOut: 1000
                }
              );
            }
          });
        }
        if (item.status != 500) {
          this.refs.alert.warning(
            '诊断进行中...',
            '状态',
            {
              timeOut: 5000,
              extendedTimeOut: 1000
            }
          );
        }
      }
    });

  },

  _switch(obj) {
      this.setState({
        pdfContent: obj
      });
  },

  render() {

    return (
      <div className="container-report-bg">
        <ToastContainer
            ref="alert"
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
        />
        <Head _switch={this._switch}/>
        <PdfContent {...this.state}/>
      </div>
    )
  }
});

module.exports = Index;
