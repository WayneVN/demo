const Reflux = require('reflux');
const InternalTabActions = require('../actions/InternalTabActions');
import InternalModal from '../model/internalModal';
const Time = require('../util/getTime');

var InternalTabStore = Reflux.createStore({
  listenables: [InternalTabActions],
  dataList: {},
  select: null, //缓存筛选条件
  page:1,
  // 初始化无条件查询
  onInitQuery() {
    InternalModal.initEvents(data => {
      this.dataList = data;
      this.trigger(this.dataList);
    });
  },
  // 带条件查询
  onSetSelect(parmas) {
    let uri = '?';
    for (let i = 0; i < parmas.length; i++) {
      let list = [];
      let {
        val, key
      } = parmas[i];
      let _val = null;
      for (let j = 0; j < val.length; j++) {
        if (val[j].clazz) {
          // 把选项折算为时间
          if (key == 'after') {
            _val = Time.getCurrTime(j);
          } else if (key == 'event_type') {
            switch (j) {
              case 1:
                _val = [2,3];
                break;
              case 2:
                _val = 4;
                break;
              case 3:
                _val= [0,1,5];
                break;
              case 4:
                _val = [6,7];
                break;
            }
          } else if(key=='board') {
              _val = j-1;
          }else {
              _val = j;
          }
          if (j != 0) {
            list.push(_val);
          }
        }
      }
      uri += `${parmas[i].key}=${list.lenght==0?' ':list.toString()}&`;
    }
    if (uri === '?after=0&event_type=0&board=0&is_vip=0') {
      InternalTabActions.initQuery();
    } else {
      // 将当前筛选条件缓存到select中
      this.select = uri;
      this.page = 1;
      InternalModal.getEvents(uri, (data) => {
        this.dataList = data;
        this.trigger(this.dataList);
      });
    }
  },
  onSetPageNum:function(newPage){
    this.page = newPage;
    let _uri = `${this.select?this.select:'?'}page_num=${this.page}`;
    InternalModal.getEvents(_uri, (data) => {
      this.dataList = data;
      this.trigger(this.dataList);
    });
  },
  onQueryAll() {

  }
});

module.exports = InternalTabStore;
