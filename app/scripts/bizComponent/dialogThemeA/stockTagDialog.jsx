"use strict"
/**
 * 股票标签管理组件
 */

var React = require('react');
var DialogThemeA = require("../../component/dialogThemeA");
var AlertActions = require('../../actions/AlertActions');
var If = require('../../component/if');
var DialogAction = require('../../actions/dialogAction');
var Dialog = DialogAction.Dialog;
var AlertActions = require('../../actions/AlertActions');
var StockAction = require('../../actions/stockAction');
var logger = require('../../util/logger');
var TagModal = require('../../model/tagModal');

var StockTagDialog = React.createClass({

  getInitialState() {
    return ({
      title: '标签管理',
      stock_name: this.props.stock_name, // 股票名称
      stock_id: this.props.stock_id, // 股票代码
      tag_content: '', // 新建标签
      tagList: [], // 已有标签
    });
  },

  componentDidMount() {
    this.getList();
  },

  getList() {
    var tagList =[];
    var {
      stock_id
    } = this.state;

    TagModal.list(stock_id, (list) => {
      for (var i in list) {
        let tag = list[i].tag;
        let tag_id = list[i].tag_id;
        tagList.push(
          <span className="orange-user-arrow">
            {tag}<i className="fa fa-times arrow-del"  onClick={() => this.delTag(tag_id)} ></i>
          </span>
        )
      }

      this.setState({
        tagList: tagList,
      })

    })

  },

  delTag(tag_id) {
    if (confirm('确认删除该标签?')) {
      TagModal.del(tag_id, () => {
        AlertActions.success('删除标签成功', '删除标签');
        this.getList();
        StockAction.getList();
        //DialogAction.close();
      });
    }
  },

  submit() {
    let {
      tag_content,
      stock_id,
      tagList
    } = this.state;

    if (tagList.length >= 10) {
      AlertActions.error("添加失败", "最多只能添加10个标签");
    } else if(tag_content.length == 0) {
      AlertActions.error("添加失败", "标签不能为空");
    } else if(tag_content.length > 10){
      AlertActions.error("添加失败", "每个标签不超过10个字");
    }else {
      TagModal.create(stock_id, tag_content, () => {
        logger.log({
          target: 'web_index_add_stock_tag',
        });
        AlertActions.success('添加标签成功', '添加标签');
        this.setState({
          tag_content: ''
        }, () => {
          this.getList();
          StockAction.getList();
          //添加标签
          //DialogAction.close();
        });
      });

    }

  },

  //设置state值
  setValue: function(e) {
    var data = {};
    var name = e.currentTarget.attributes.name.value,
      value = e.target.value;

    data[name] = value.trim();
    this.setState(data);
  },

  onKeyItem(e) {
    if (e.keyCode == 13) { //回车
      this.submit();
    }
  },

  render() {
    let {
      stock_name,
      stock_id,
      tag_content,
      title,
      tagList
    } = this.state;

    return (
      <DialogThemeA title= {title}>
        <DialogThemeA.Body>
          <div className="panel-row">
            <div className="panel-col">
              <label >股票名称</label>
              <span>{stock_name}</span>
            </div>
            <div className="panel-col flr">
              <label >股票代码</label>
              <span>{stock_id ? stock_id.split('.')[0] : ''}</span>
            </div>
          </div>
          <div className="panel-row">
            <label >股票标签</label>
            {tagList}
          </div>
          <div className="panel-row">
              <label >添加标签</label>
              <input name="tag_content"
                     value={tag_content}
                     onChange={this.setValue}
                     onKeyDown={this.onKeyItem}
              />
              <a href="javascript:;" className="btn-step-next flr"  onClick={this.submit}>
                添加
              </a>
          </div>
          <div className="panel-row">
            <span className="ml-10">最多添加十个标签,每个标签不超过10个字.</span>
          </div>
        </DialogThemeA.Body>
      </DialogThemeA>
    );
  },
});

module.exports = StockTagDialog;
