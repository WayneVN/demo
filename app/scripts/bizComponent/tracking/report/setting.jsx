/**
 * @file 记账报告-设置
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var HeadAction = require('../../../actions/headAction');
var PageEnum = require('../../../util/pageEnum');
var SettingModal = require('../reportModal/settingModal');
var If = require('../../../component/if');

var Setting = React.createClass({

  getInitialState: function () {
    return {
      showDialog: '',
      setting: this.props.setting
    }
  },

  getDefaultProps: function () {
    return {
      data: {}
    }
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps);
  },

  open: function (type) {
    var me = this;

    me.setState({
      showDialog: type
    });
  },

  hide: function () {
    this.open('');
  },

  openFeedback: function () {
    HeadAction.openUserCenter(PageEnum.userAccount.feedback);
  },
  
  render: function () {
    var me = this;
    var {
      state: {
        showDialog,
        setting
      }
    } = me;

    return (  
      <div>  
        <If when={showDialog == 'setting'}>
          <SettingModal hide={me.hide} onOk={me.props.onOk} setting={setting}/>
        </If> 

        <div className="shortcutBox-btn hover-active"
             onMouseEnter={()=>this.open('setting')}
        >
          <div className="active-box ">
          <span>偏&nbsp;好</span>
          <br/>
          <span>设&nbsp;置</span>
          </div>
        </div>
        <div className="shortcutBox"
             onClick={this.openFeedback}
        >
          <div className="active-box ">
            <span>意&nbsp;见</span>
            <br/>
            <span>反&nbsp;馈</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Setting;
