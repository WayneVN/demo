/**
 * 春训营－我的帐户-帐户信息
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
const Reflux = require('reflux');
const SummerModel = require('../../../model/summerModel');
const ReloadAction = require('../../../actions/ReloadActions');
const userinfo = require('../../../util/userInfo');
const logger = require('../../../util/logger');
const _ = require('lodash');
const DialogAction = require('../../../actions/dialogAction');
const Dialog = DialogAction.Dialog;
import {Modal} from 'react-bootstrap';
import ReactToastr, {ToastContainer} from "react-toastr";
const ToastMessageFactory = React.createFactory(
  ReactToastr.ToastMessage.animation
);

const UserInfo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      show: false,
      email: ''
    }
  },

  transact: function() {
    const {
      props: {
        data: {
          uid,
          courses = []
        },
        params: {
          courseId
        }
      }
    } = this;
    let obj = {
      course_id: courseId,
      uid: uid
    };

    DialogAction.open(Dialog.Transact, obj);
  },

  checkReg: function () {
    this.setState({
      show: !this.state.show
    });
  },

  renderModal: function () {
    let {
      state: {
        show
      }
    } = this;

    return (
      <Modal show={show}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.checkReg}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <span className="flr" onClick={this.checkReg}>
              <i className="fa fa-times" />
            </span>
            <div className="step-warp" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">
              <div className="panel-row">
                <label >*邮&nbsp;&nbsp;箱</label>
                <p>
                  <input type="email"  valueLink={this.linkState('email')} />
                </p>
              </div>
            </div>
            <div className="panel-footer">
              <span
                 className="btn-step-next flr"
                 onClick={this.send} >
                发送
              </span>
              <span
                 className="btn-step-next flr"
                 onClick={this.checkReg} >
                关闭
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  },

  send: function () {
    let {
      state: {
        nick = '',
        email = '',
        userInfo
      }
    } = this;
    let {
      status,
      data
    } = userinfo.get();

    let obj = {
      user_id: data.user_id,
      email: email,
      course_id: this.props.params.courseId
    };

    SummerModel.userRegister(obj, result => {
      let {
        status,
        data,
        message
      } = result;

      if(status) {
        this.setState({
          show: false
        }, () => {
          ReloadAction.reload();
          logger.log({
            target: 'summer_singup'
          });
          this.alertMsg(
            'success',
            '',
            '报名成功'
          );
        });
      }
      else {
        this.alertMsg(
          'error',
          '',
          message
        );
      }
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

  // 根据权限判别按钮
  renderBtn: function () {
    const {
      props: {
        data: {
          email,
          user_name,
          uid,
          courses = []
        },
        params: {
          courseId
        }
      }
    } = this;

    const ROLE_LIST = {
      0: '未审核',
      1: '普通',
      2: '普通',
      4: '土豪版'
    };
    let obj = _.find(courses, ['course_id', +courseId]);
    if(!obj) {
      return (
        <span className="jd-btn jd-btn-orange" onClick={event => {
            this.checkReg()
          }}>
          立即报名
        </span>
      );
    }
    else {
      return (
        <div>
          <span className="s-line-type">
            {ROLE_LIST[+obj.student_type]}
          </span>
          {
            obj.student_type != 4?
            <a href="javascript:;"
               className="s-line-link"
               onClick={e => { this.transact() }}
            >
              开通土豪版
            </a>: <noscript />
          }
        </div>
      )
    }
  },

  render: function () {
    const {
      props: {
        data: {
          email,
          user_name,
          uid,
          courses = []
        },
        params: {
          courseId
        }
      }
    } = this;
    let class_id = _.find(courses, ['course_id', +courseId]).class_id;

    let IMGMAP = {
      7:{
        1: {
          name: '春训营 【经典版】 1班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E7%BB%8F%E5%85%B8%E7%89%88%E4%B8%80%E7%8F%AD.jpg' // 经典1班
        },
        2: {
          name: '春训营 【经典版】 2班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E7%BB%8F%E5%85%B8%E7%89%88%E4%BA%8C%E7%8F%AD.jpg'
        }
      },
      8:{
        1: {
          name: '春训营 【升级版】 1班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E5%8D%87%E7%BA%A7%E7%89%88%E4%B8%80%E7%8F%AD.jpg' //升级1班
        },
        2: {
          name: '春训营 【升级版】 2班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E5%8D%87%E7%BA%A7%E7%89%88%E4%BA%8C%E7%8F%AD.jpg'
        }
      },
      9:{
        1: {
          name: '春训营 【聚源版】 1班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E8%81%9A%E6%BA%90%E7%89%88%E4%B8%80%E7%8F%AD.jpg' // 剧院1班
        },
        2: {
          name: '春训营 【聚源版】 2班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/%E8%81%9A%E6%BA%90%E7%89%88%E4%BA%8C%E7%8F%AD.jpg'
        }
      },
      10:{
        1: {
          name: '春训营 【choice版】 1班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/choice%E7%89%88%E4%B8%80%E7%8F%AD.jpg'
        },
        2: {
          name: '春训营 【choice版】 2班',
          url: 'http://onb7pfrdl.bkt.clouddn.com/choice%E7%89%88%E4%BA%8C%E7%8F%AD.jpg'
        }
      }
    }

    return (
      <div className="spring-userinfo">
        <ToastContainer ref="alert"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
        {this.renderModal()}
        <div className="s-line-group fll">
          <label>用户名</label>
          <p>{user_name}</p>
        </div>
        <div className="s-line-group fll">
          <label>类型</label>
          {this.renderBtn()}
        </div>
        <div className="s-line-group fll">
          <label className="s-clazz-label" >
            班级
          </label>
          <p className="s-clazz-p">
            {courseId>=7?IMGMAP[courseId][class_id].name:class_id}
          </p>
          {
            courseId>=7? (
              <div className="s-clazz-warp">
                <img  src={IMGMAP[courseId][class_id].url} className="s-clazz-img" />
                <p>微信扫码进入班级群</p>
              </div>

            ): (
              <noscript />
            )
          }

        </div>

      </div>
    );
  }
});

module.exports = UserInfo;
