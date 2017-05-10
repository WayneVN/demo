/**
 * @file url工具方法
 * @author min.chen@joudou.com
 */

module.exports = {

    /**
     * @file GET请求 解析url,返回key/value的对象
     */
    getUrlOption: function (url) {
        var str = url.split('?')[1] || '';
        var temp = str.split('&');
        var obj = {};

        for (var k in temp) {
            var item = temp[k];
            var data = item.split('=');

            obj[data[0]] = data[1];
        }
        return obj;
    },


    getEnv: function (req) {
        var host = req.hostname;
        var env = 'local';

        if (host.indexOf('joudou.com') > -1) {
            env = 'www';
        }

        if (host.indexOf('dev.joudou.com') > -1) {
            env = 'dev';
        }

        if (host.indexOf('test.joudou.com') > -1) {
            env = 'test';
        }

        return env;
    },

    /**
     * 获取主站的域名
     */
    getMainHostName: function (host) {
        var env = this.getEnv(host);

        var hostname = {
            www: 'www.joudou.com',
            dev: 'dev.joudou.com',
            test: 'test.joudou.com',
            local: ''
        };

        return hostname[env];
    }
}