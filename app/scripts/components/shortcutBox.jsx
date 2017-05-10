import React, {Component} from 'react';
import {Modal,ModalBody,ModalFooter} from './modals';
import _UserModal from '../model/mergerModal';
const UserModal = new _UserModal();
import If from './If';
import _ from '_';

export default class ShortcutBox extends Component {
  constructor(props) {
    super(props);
    this.state ={
      checkboxList:[],
      textVal:null,
      error:'',
      disabled:false,
      success:'',
      isShow:false
    };
  }
  _onSend =e=> {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    let {checkboxList, textVal} = this.state;
    if (checkboxList.length==0 && !textVal) {
      this.setState({
        error:'不可为空,请重新填写!'
      });
    } else {
      let obj ={
        choose:this.state.checkboxList.toString(),
        desc:this.state.textVal,
        url:window.location.hash
      }
      UserModal.userFeedback(obj,data=>{
        if (data.status) {
          this.setState({
            checkboxList:[],
            textVal:null,
            error:'',
            success:'提交成功,2秒后自动关闭窗口！'
          },()=>{
            setTimeout(()=>{
              this.props.close();
            }, 2000);
          });
        }
      });
    }
  }
  _onClickItem =e=> {
    let {value} = e.target;
    let list = this.state.checkboxList;
    let _list =[];
    if (this.findArrVal(list,value)) {
      list = this.removeArrIndex(list,value);
    } else {
      list.push(value);
    }
    this.setState({
      checkboxList:list,
      isShow:value==5?true:false
    });
  }
  removeArrIndex(arr,value){
    let _list = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] != value) {
        _list.push(arr[i]);
      }
    }
    return _list;
  }
  findArrVal(arr,where){
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == where) {
        return true;
      }
    }
    return false;
  }
  _onChageIssue =e=>{
    let {target:{value}} = e;
    this.setState({
      textVal:value
    });
  }
  render () {
    let {state:{isShow}} = this;
    return(
        <form className='forms-lg'>
          <div className="form-head">
            <p className="form-title" style={{marginLeft:50,Top:20}}>
              <span className="title">意见反馈</span>
              <br />
              <span className="smail">FEEDBACK</span>
            </p>
          </div>
        <div className="form-hr form-hr-lg" />
        <p className="box-info">亲爱的九斗用户:</p>
        <p className="box-info">请在下面填写您遇到的问题或意见建议，感谢您对我们的支持！</p>
        <ul className="box-item">
          <li>
            <input type="radio" name="issue_item" value="1" id="item1" onChange={this._onClickItem}/>
            <label htmlFor="item1">数据错误</label>
          </li>
          <li>
            <input type="radio" name="issue_item" value="2" id="item2" onChange={this._onClickItem}/>
            <label htmlFor="item2">显示有问题</label>
          </li>
          <li>
            <input type="radio" name="issue_item" value="3" id="item3" onChange={this._onClickItem}/>
            <label htmlFor="item3">网站bug</label>
          </li>
          <li>
            <input type="radio" name="issue_item" value="4" id="item4" onChange={this._onClickItem}/>
            <label htmlFor="item4">功能错误</label>
          </li>
          <li>
            <input type="radio" name="issue_item" value="5" id="item5" onChange={this._onClickItem} />
            <label htmlFor="item5">更多问题,请联系九斗客服微信&nbsp;<i className="fa fa-wechat" /></label>
          </li>
        </ul>
        <If when={!isShow}>
          <div className="issue-warp">
            <textarea className="issue-text" onChange={this._onChageIssue} placeholder="其他问题，请在此输入" />
            <p className="error_msg">{this.state.error}</p>
            <p className="success_msg">{this.state.success}</p>
            <span className="btn-showdown-md" onClick={this._onSend}>提交反馈</span>
          </div>
        </If>
        <If when={isShow}>
          <img src="../../images/ercode.jpg" className="ercode" />
        </If>
      </form>
    );
  }
}
