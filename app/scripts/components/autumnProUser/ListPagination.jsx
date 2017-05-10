/**
 * 春训营－列表分页
 * @author chenmin@joudou.com
 */
const React = require('react');
const _ = require('_');
const logger = require('../../util/logger');

const ListPagination = React.createClass({
  getInitialState: function() {
    return {
      curPage: 0,                // 当前所在页码
      total: this.props.data.length,
      prevDis: true,
      nextDis: false,
      activeItem: 0
    };
  },

  componentDidMount: function() {
    logger.log({
      target: `autumnPro2016_${ this.props.type }Pagination_page`
    });
  },

  prev: function() {
    let {
      state: {
        prevDis,
        curPage
      }
    } = this;

    if (!prevDis) {
      this.setState({
        curPage: curPage-1
      }, () => {
        this.isPage();
      });
    }
  },

  next: function() {
    let {
      state: {
        nextDis,
        curPage,
      }
    } = this;

    if (!nextDis) {
      this.setState({
        curPage: +curPage+1
      }, () => {
        this.isPage();
      });
    }
  },

  // 控制翻页按钮是否可点击
  isPage: function() {
    let {
      state: {
        nextDis,
        curPage,
        prevDis,
        total
      }
    } = this;

    this.setState({
      nextDis: curPage == total-1,
      prevDis: curPage == 0
    },() => {
      // 将当前选中项，url返回出去
      this.props.renderUrl(this.props.data[curPage]);
    });
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.state.curPage != nextState.curPage) {
      logger.log({
        target: `autumnPro2016_${ this.props.type }Pagination_page`
      });
    }
  },

  filterData: function(data) {
    let item = [];
    for (var i = 0; i < data.length ; i++) {
      item.push(data[i].substring(14, data[i].length -4));
    }
    return item;
  },

  changePage: function(e) {
    let {
      target: {
        value: v
      }
    } = e;

    this.setState({
      curPage: v
    }, () => {
      this.isPage();
    });
  },

  render: function() {
    const {
      props: {
        data
      }
    } = this;
    let {
      state: {
        prevDis,
        nextDis,
        curPage
      }
    } = this;
    let list = this.filterData(data);

    return (
      <div>
        <span onClick= {this.prev}
              className={
                `jd-btn fll ${ prevDis ? ' btn-step-disabled':'jd-btn-orange'}`
              }
          >
         上一页
        </span>
        <select className="form-control"
                style={{
                  width:200,
                  marginLeft:20,
                  marginRight:20,
                  float:'left'
                }}
                onChange = {this.changePage}
                >
          {
            list.map((item,k) => {
              return <option key={k} value={k} selected={k==curPage} >{item}</option>
            })
          }
        </select>
        <span onClick= {this.next}
              className={
                `jd-btn fll ${ nextDis ? ' btn-step-disabled':'jd-btn-orange'}`
              }
          >
          下一页
        </span>
      </div>
    );
  }
});

module.exports = ListPagination;
