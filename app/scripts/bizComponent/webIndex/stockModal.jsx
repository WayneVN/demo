'use strict';

const React = require('react');
const {Modal} = require('react-bootstrap');
const _ = require('_');
const $ = require('jquery');
const If = require('../../component/if');
const moment = require('moment');
const numeral = require('numeral');
const Loading = require('../../component/loading');
const FavorstockModal = require('../../model/favorstockModal');
const AlertActions = require('../../actions/AlertActions');

const StockModal = React.createClass({
  getInitialState() {
    return {
      isLoading: true,
      tagName: '',
      tagList: []
    }
  },

  getDefaultProps() {
    return {
      stockObj: {}
    }
  },

  componentDidMount() {
    const {
      props: {
        stockObj: {
          tags
        }
      }
    } = this;
    let list = [];

    if (tags && tags.length>0) {
      list = tags.split(',');
    }
    this.setState({
      tagList: list
    });

    this.getData();
  },

  getData() {
    const {
      props: {
        stockId
      }
    } = this;
  },

  renderHead() {
    return (
      <div className="modal-head">
        <img alt="logo" src="./images/JOUDOU.COM.png" className="m-head-logo"/>
        <h2>设置自选股</h2>
        <i className="fa fa-remove"
           onClick={() => {this.props.closeModal()}}
        />
      </div>
    );
  },

  addTag() {
    let desc = _.clone(this.state.tagName);
    let _tList = this.state.tagList;
    let obj = {
      secucode: this.props.stockObj.secucode,
      desc: desc
    };
    if(this.state.tagName.length > 10 ||
       !this.state.tagName ||
       !this.state.tagName.length
    ) {
      AlertActions.open('error','注意','字符长度为1~10位!');
      return ;
    }
    FavorstockModal.addTag(obj, (err, result) => {
      if (result && result.status) {
        AlertActions.open('success','成功','添加标签成功。');
        this.setState({
          tagList: _.concat(this.state.tagList, obj.desc),
          tagName: ''
        },() => {
          this.props.cb();
        });
      }
      else {
        AlertActions.open('error','添加标签错误','请检查标签是否重复或是否超过10个标签。');
      }
    });
  },

  removeTag(desc) {
    let obj = {
      secucode: this.props.stockObj.secucode,
      desc: desc
    };

    FavorstockModal.removeTag(obj, (err, result) => {
      if (result && result.status) {
        AlertActions.open('success','成功','删除标签成功。');
         _.remove(this.state.tagList, o => o == desc );
        this.setState({
          tagList: this.state.tagList
        },() => {
          this.props.cb();
        });
      }
      else {
        AlertActions.open('error','错误',result.data);
      }
    });
  },


  changeTagName(e) {
    let {
      target: {
        value
      }
    } = e;

    this.setState({
      tagName: value
    });
  },

  renderBody() {
    const {
      props: {
        stockObj: item
      }
    } = this;

    return (
      <div className="stock-modal-body">
        <span className="stock-text-first">
          {`${ item.secuname }(${ item.secucode.split('.')[0] })`}&nbsp;
        </span>
        <span className="stock-text-first-sub">
          {`${ moment(item.added_date.toString()).format('YYYY/MM/DD') }`} 加自选
        </span>
        {this.renderAdd()}
        {/* {this.renderAddTip()} */}
      </div>
    );
  },

  // 增加标签
  renderAdd() {
    let {
      state: {
        tagName,
        tagList
      }
    } = this;

    return (
      <div className="stock-add-warp">
        <label for="in">添加标签</label>
        <input name="in" id="in" type="text"
               className="stock-add-input"
               value={tagName}
               onChange={this.changeTagName}
        />
        <span
            className="stock-add-plus"
            onClick={() => {this.addTag()}}
        >
          <i className="fa fa-plus" />
        </span>
        <br/>
        <div style={{
          width: 410,
          display: 'inline-block'
        }}>
          {
            tagList.map((item, k) => {
              return <span className="user-arrow orange-user-arrow" key={k}>
          {item}
          <i className="fa fa-remove" onClick={() => {this.removeTag(item)}} />
              </span>
            })
          }
        </div>

      </div>
    )
  },

  // 添加提醒
  renderAddTip() {
    return (
      <div className="stock-add-tip-warp">
        <div className="stock-tip-radio">
          <label className="stock-tip-title">添加提醒</label>
          <div className="stock-tip-group">
            <label htmlFor="t1">-4%~12%</label>
            <input name="ra" id="t1" type="radio" value="1"/>
          </div>
          <div className="stock-tip-group">
            <label htmlFor="t2">-8%~25%</label>
            <input name="ra" id="t2" type="radio" value="1"/>
          </div>
          <div className="stock-tip-group">
            <label htmlFor="t3">-16%~50%</label>
            <input name="ra" id="t3" type="radio" value="1"/>
          </div>
        </div>

        <div className="stock-tip-from">
          <ul className="stock-tip-from-title">
            <li>&nbsp;</li>
            <li>收盘价高于</li>
            <li>收盘价低于</li>
          </ul>
          <ul className="stock-tip-from-title">
            <li>价格</li>
            <li>
              <input name="" type="text" value=""/>
            </li>
            <li>
              <input name="" type="text" value=""/>
            </li>
          </ul>
          <ul className="stock-tip-from-title">
            <li>涨跌幅</li>
            <li className="por">
              <input className="input-pr" type="text" value=""/>
              <span className="input-suffix">%</span>
            </li>
            <li className="por">
              <input className="input-pr"
                     type="text"
                     disabled="true"
                     value=""/>
              <span className="input-suffix">%</span>
            </li>
          </ul>
          <ul className="stock-tip-from-title">
            <li>&nbsp;</li>
            <li>
              <span className="btn-switch ">
                <span className="btn-switch-inner" />
              </span>
            </li>
            <li>
              <span className="btn-switch btn-switch-checked">
                <span className="btn-switch-inner" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  },

  render() {
    let {
      state: {
        isLoading
      }
    } = this;

    return (
      <Modal show={true}
             container={this}
             {...this.props}
             dialogClassName="stock-modal report-setting-modal chart-modal-lg "
             onHide={() => {
                 this.props.closeModal()
               }}
      >
        {this.renderHead()}
        <If when={isLoading}>
          {this.renderBody()}
        </If>

        <If when={!isLoading}>
          <Loading />
        </If>

      </Modal>
    );
  }

});

module.exports = StockModal;
