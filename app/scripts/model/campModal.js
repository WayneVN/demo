var http = require('../util/http');

var CampModal = {

  //视频列表
  getForumList(numbers, callback) {
    var url = `/videos?numbers=${numbers}`;
    http.get(url, (error, results) => {
      if(results.status){
        callback(results.data)
      }else {
        callback([]);
      }
    })
  },

  //添加视频播放次数
  addPlayNums(id, callback) {
    var url = `/videos/${id}/playtimes`;
    http.post(url, {
    }, (err, data) => callback(data));
  },

  //获取对应的讲堂视频信息
  getForum(id, callback){
    var url = `/videos/${id}`;
    //获取播放次数
    http.get(url, (err, results) =>{
        callback(results.data);
    });

  },

  /**
   * 获取视频评论列表
   * @param id  视频id
   * @param page 页数
   * @param page_size 单页显示数 默认是20
     */
  getComments(id, page, page_size, callback) {
    var url  = `/videos/${id}/comments?page=${page}${page_size ? '&page_size='+page_size :''}`;
    http.get(url, (error,results) => {
      callback(results.data);
    })
  },

  /**
   * 发送评论
   * @param id
   * @param content
     */
  postComment(id, content, callback) {
    var url =`/videos/${id}/comments`;
    http.post(url, {
      content: content,
    },(error, results) => callback(results));

  },

  getLatest(callback) {
    const url = `/article/latest`;
    http.get(url, (error, results) => {
      callback(results);
    });
  },

  getMore(callback) {
    const url = `/article/more`;
    http.get(url, (error, results) => {
      callback(results);
    });
  },

  // 用户验证订单号
  userRegisterByOrder(obj, callback) {
    const url = `/camp/students/userRegisterByOrder`;
    http.post(url, obj, (error, results) => callback(results));
  }


};

module.exports = CampModal;
