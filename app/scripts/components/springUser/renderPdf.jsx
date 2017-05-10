/**
 * 春训营－查看pdf
 * @author chenmin@joudou.com
 * @params {url : String}
 */

const React = require('react');
const SpringModel = require('../../model/springModel');
const user = require('../../util/userInfo');
const logger = require('../../util/logger');
import If from '../../components/If';
const _ = require('_');
// import PDF from '../../components/pdf';
const RenderPdf = React.createClass({

  getInitialState: function () {
    return {
      userInfo: {},
      isStatus: false,
      tableList: {},
      uri: ''
    };
  },

  componentDidMount: function () {
    this.getData();
  },

  getData: function () {
    const {
      props: {
        params: {
          path,
          type
        }
      }
    } = this;
    let prefix = type == 'task'? 'jobs': 'answers';
    const {
      data,
      status
    } = user.get();
    if (status) {
      SpringModel.studentsUserInfo(data.user_id, result => {
        let {
          status = false,
          data = {}
        } = result;
        if(status) {
          logger.log({
            target: `spring_pdf_${ prefix }_${ path }`
          });
          this.setState({
            uri: `jobfiles/${ prefix }/${ path }`
          });
        }
      });
    }

  },

  render: function() {
    let {
      state: {
        tableList,
        uri
      }
    } = this;
    // <PDF url={uri} />
    return (
      <div className="container bn">
        <If when={uri}>
          <img src={uri} style={{
                 margin:'0 auto',
                 textAlign: 'center',
                 display: 'inherit'
               }}/>
        </If>
      </div>
    )
  }
});

module.exports = RenderPdf;
