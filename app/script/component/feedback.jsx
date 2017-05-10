/**
 * 意见反馈
 */

var React = require('react');
var DialogAction = require('../action/dialogAction');
var Dialog = DialogAction.Dialog;
var PageEnum = require('../bizComponet/userCenter/config');
import Storage from '../util/storage';
var storage = new Storage();

var Feedback = React.creatClass({

    open: function () {

        if (!storage.getStore('USER_ID')) {
            DialogAction.open(Dialog.WechatLogin);
        }
        else {

          DialogAction.open(Dialog.UserCenter, {
            page: PageEnum.userAccount.feedback
          })
        }
    },

    render: function () {
        return (
            <div className="shortcutBox">

            <div className="active-box _active"
                 onClick={this.open}>
              意 见<br/>反 馈
            </div>

          </div>
        )
    }
});

module.exports = FeedBack;