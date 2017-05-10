'use strict';
/**
 * 基础搜索提示组件
 * @type {*|exports|module.exports}
 */
var React = require('react');
var If = require('./if');
var Logger = require('../util/logger');

var BaseSearch = React.createClass({

  getDefaultProps() {
    return({
      result: new Array(),
      onFocus: () => {},
      onBlur: () => {},
      onChangeCallback: (value) => {},
      onSearch: (title) => {},
    })

  },

  getInitialState() {
    return({
      val:this.props.val,
      result:this.props.result,
      active:0
    })
  },

  onChange(e) {
    this.setState({val:e.target.value});
    this.props.onChangeCallback(e.target.value);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.result != this.props.result) {
      this.setState({
        result:nextProps.result,
        active:0
      });
    }
  },

  onKeyItem(e) {
    const keys ={
      DOWN_KEY : 40,
      ENTER_KEY : 13,
      ESC_KEY : 27,
      TAB_KEY: 9,
      UP_KEY : 38,
    };
    let {
      state: {
        active,
      },
      props: {
        result
      }
    } = this;
    switch (e.keyCode) {
      case keys.DOWN_KEY:
        this.setState({
          active: active < result.length -1 ? active+1 : result.length-1
        });
        break;
      case keys.UP_KEY :
        this.setState({
          active: active>=1 ? active-1 : 0
        });
        break;
      case keys.ENTER_KEY :
        this.props.onSearch(this.state.result[state.active]);
        this.onCloseItem();
        break;
      case keys.ESC_KEY:
        this.setState({
          result:[]
        });
        break;
    }
  },

  onCloseItem(e) {
    this.setState({result:[], val: ''});
  },

  onClickItem(e) {
    Logger.log({
      target: 'favorstock_seculist',
      data: {
        plt: 'pc'
      }
    });
    this.setState({
      val:e.target.title,
      result:[]
    });
    this.props.onSearch(e.target.title);
    this.onCloseItem();
  },

  onFocus(e) {
    this.props.onFocus();
    this.onCloseItem();
  },

  onBlur(e){
    this.props.onBlur();
  },

  render () {
    const {
      props: {
        placeholder
      }
    } = this;
    let {
      state: {
        val,
        result,
        active
      }
    } = this;

    return(
      <div>
        <div className={!result.length || 'autocomplete-mark'}
             onClick={this.onFocus} />
        <div className="autocomplete mhs" >
            <input placeholder={placeholder}
                   value={val}
                   onChange={this.onChange}
                   onKeyDown={this.onKeyItem}
                   className="autocomplete-input form-control"
                   onFocus={this.onFocus}
                   onBlur = {this.onBlur}
                   type="search" />
            <If when={result.length>=1}>
              <ul className="autocomplete-list" >
                {
                  result.map((item, key) => {
                    return (
                      <li key={key} onClick={this.onClickItem}>
                        <a href="javascript:;"
                           title={item}
                           onClick={(e) => { this.onClickItem(e) }}
                           className={active==key?'autocomplete-item highlighted':'autocomplete-item'}>
                          {item}
                        </a>
                      </li>
                    )
                  })
                }
              </ul>
            </If>
          </div>
      </div>
    )
  }

});

module.exports = BaseSearch;
