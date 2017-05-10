/**
 * 春训营－用户列表
 * @author chenmin@joudou.com
 */
"use strict";

const React = require('react');
import {Modal} from 'react-bootstrap';
const SpringModel = require('../../../model/summerModel');


const EditUser = React.createClass({
  getInitialState: function () {
    return {
      clazz: 1,
      type: 1
    };
  },

  getDefaultProps: function() {
    return {
      show: false,
      item: {},
      id: -1,
    }
  },

  componentDidMount: function () {
    this.setState({
      item: this.props.item,
      show: this.props.show
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      item: nextProps.item,
      show: nextProps.show,
      clazz: nextProps.item.class_id,
      type: nextProps.item.student_type
    });
  },

  hide: function () {
    this.props.hide();
  },

  update: function () {
    let obj =  {
      uid: this.props.data.uid,
      student_id: this.props.item.student_id,
      student_uid: this.props.item.user_id,
      class: this.state.clazz,
      student_type: this.state.type,
      course_id: this.props.selectVal
    };

    SpringModel.modifyStudentsInfo(obj, result => {
      if (result.status) {
        this.props.alert('success','更新成功','');
      }
      else {
        this.props.alert('error','失败',result.message);
      }
      this.props.hide();
    });
  },

  changeClass: function(e) {
    this.setState({
      clazz: e.target.value
    });
  },

  changeStutype: function(e) {
    this.setState({
      type: e.target.value
    });
  },

  render: function () {
    const {
      props: {
        show,
        item
      }
    } = this;

    return (
      <Modal show={show}
             dialogClassName="custom-modal-lg panel-step-bg "
             container={this}
             aria-labelledby="contained-modal-title"
             onHide={this.hide}
             >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            <img src="./images/JOUDOU.COM.png"/>
            <a href="javascript:;" className="flr" onClick={this.hide}>
              <i className="fa fa-times" />
            </a>
            <div className="step-warp">

            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-step-center">
            <div className="panel-body">

              <div className="panel-row">
                <label >ID</label>
                <p>{item.user_id}</p>
              </div>
              <div className="panel-row">
                <label for="">用户名</label>
                <p>{item.user_name}</p>
              </div>
              <div className="panel-row">
                <label for="">班级</label>
                <select defaultValue={item.class_id} onChange={this.changeClass}>
                  <option value="1">一班</option>
                  <option value="2">二班</option>
                  <option value="3">三班</option>
                  <option value="4">四班</option>
                  <option value="5">五班</option>
                </select>
              </div>
              <div className="panel-row">
                <label >是否报名</label>
                <select defaultValue={item.student_type} onChange={this.changeStutype} >
                  <option value="0">未审核</option>
                  <option value="1">普通</option>
                  <option value="2">付费</option>
                </select>
              </div>
            </div>
            <div className="panel-footer">
              <span
                 className="btn-step-next flr"
                 onClick={this.hide} >
                关闭
              </span>
              <span
                 className="btn-step-next flr"
                 onClick={this.update} >
                更新
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = EditUser;
