/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "获取当前用户是否登陆"
 */

import storage from './storage';
const Storage = new storage();
require('../plugin/jquery.cookie/jquery.cookie');

var userinfo = {
    data: null,
    get: function() {
        return this.data || Storage.getStore('USER_ID') || Storage.getStore('c_userInfo');
    },
    set: function(params) {
        this.data = params;

        if (params.data && params.data.user_id) {
            $.cookie('uid', params.data.user_id);
        }
        else {
            $.removeCookie('uid');
        }
    }
}

module.exports = userinfo;
