/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "交易诊断－head"
 */

const React = require('react');
const _ = require('_');
const DiagnosedModel = require('../../../model/diagnosedModel');
const moment = require('moment');

const PdfContent = React.createClass({
  getInitialState() {
    return {
      record: {},
      _progress: 0,
      titleNum: 0,
      error: false
    };
  },

  componentDidMount() {
  },

  render() {
    const {
      props: {
        pdfContent
      }
    } = this;

    function renderPdf() {
      return (
        <div>
          {
            pdfContent.pics.map((item, k) => {
              return (
                  <img key={k}
                       src={`./stockinfogate/trdiagnosis/pic/${item}`}
                       className="pdf-item pdf-img"/>
              )
            })
          }
        </div>
      );
    }
    let is = pdfContent.pics && pdfContent.pics.length && pdfContent.status == 500;

    return (
      <div className="container-report-body" style={{
            height: '100%'
      }}>
        <div className="pdf-panel">
          <div className="pdf-head">
            {
              is? pdfContent.title : '交易诊断案例'
            }
            <a
                href={
                  is?
                      `/stockinfogate/trdiagnosis/report/${pdfContent.id}`:
                      'javascript:;'
                     }
                className="pdf-link"
                target="_blank"
            >
              {is? <i className="fa fa-download" />:''}
              {is?'下载诊断报告':''}
            </a>
          </div>
          <div className="pdf-body" >
            {
              is ?
              renderPdf():
                <div className="demo-pdf">
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report1.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report2.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report3.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report4.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report5.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report6.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report7.jpg" className="mb20 pdf-img" />
                    <img alt="案例" src="http://onb7pfrdl.bkt.clouddn.com/report8.jpg" className="mb20 pdf-img" />
                </div>
            }

          </div>
        </div>
      </div>
    );
  }

});

module.exports = PdfContent;
