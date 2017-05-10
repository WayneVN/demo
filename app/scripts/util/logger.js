/**
 * @file 发送监控通用方法
 * @author min.chen@joudou.com
 */

import Storage from './storage';
import cookie from 'jquery.cookie';

define(function (require, exports) {

    'use strict';

    var $ = require('jquery');
    var url = require('./url');

    var path = 'https://felog.joudou.com/images/log.jpg';
    var storage = new Storage();


    if ('production' != process.env.NODE_ENV) {
        if (location.href.indexOf('test.joudou.com') > -1) {
            path = 'https://felog.test.joudou.com/images/log.jpg';
        }
        else {
            path = 'https://felog.dev.joudou.com/images/log.jpg';
        }
    }

    /**
     * @param {Object} params
     * @property {string} params.target  标志用户行为，命名：层级动作功能点（如果三层不够可以向后延伸）
     *        如点击"交易追踪"：nav_click_tally，如新增账簿失败：tally_create_account_fail;
     * @property {?Object} 可选参数
     */
    function log(params) {
        // 线上环境才有用
        // if ('production' == process.env.NODE_ENV) {
            var ifr = $('<iframe>')
                .css({
                    'position' : 'absolute',
                    'left' : '-10000px',
                    'top' : '-10000px'
                })
                .appendTo('body');


            var win = ifr[0].contentWindow;
            var idom = win.document;
            var ref = url.getSearch('ref') || '';
            var Uid = getUid();

            var html = ''
            +   '<form id="f" action="' + path + '" method="POST">'
            +       '<input type="hidden" name="target" value="' + encodeURIComponent(params.target) + '" />'
            +       '<input type="hidden" name="userid" value="' + encodeURIComponent(storage.getStore('USER_ID')) + '" />'
            +       '<input type="hidden" name="data" value="' + encodeURIComponent(JSON.stringify(params.data || {})) + '" />'
            +       '<input type="hidden" name="ref" value="' + ref + '" />'
            +       '<input type="hidden" name="Uid" value="' + Uid + '" />'
            +   '</form>'

            
            idom.open();
            idom.write(html);
            idom.close();

            idom.getElementById('f').submit();

            ifr.onload = function(){
                setTimeout(function(){
                    $(ifr).remove();
                }, 100);
            };

            setTimeout(function(){
                $(ifr).remove();
            }, 2000);
        // }

        if (window.zhuge) {
            window.zhuge.track(
                params.target,
                $.extend({
                    userid: storage.getStore('USER_ID'),
                    plt: 'pc'
                }, params.data)
            )
        }
    }

    function getUid() {
        var name = '_UID_LOG';
        var value = $.cookie(name);

        if (!value) {
            value = 'jd' + (+new Date()) + '' + Math.random();
            $.cookie(name, value);
        }

        return value;
    }


    exports.log = log;
});
