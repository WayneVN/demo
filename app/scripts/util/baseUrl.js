let BaseUrl = {
  getUrl:function() {
    let baseUrl = ''
    if ("production" != process.env.NODE_ENV) {
      baseUrl = 'http://test.joudou.com';
    }
    return baseUrl;
  }
}

module.exports = BaseUrl;
