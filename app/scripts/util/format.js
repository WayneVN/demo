"use strict";
var numeral = require('numeral');
var ListConfig = require('./listConfig');
var _ = require('_');
var format = {
    Trim: function(str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    },
    _trim: function(str) {
        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
        return str.trim();
    },
    /**
     * 匹配中文
     * @param {string} str
     * @returns {string}
     */
    beautySub: function(str, len) {
        var reg = /[\u4e00-\u9fa5]/g,
            slice = str.substring(0, len),
            realen = len - (~~(slice.match(reg) && slice.match(reg).length));
        return slice.substring(0, realen ? realen : 1);
    },
    /**
     * 字符日期格式化
     * @param {number|string} s
     * @returns {string}
     */
    stringDateFormat: function(s) {
        if (s)
            return (s + '').replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3");
        else
            return "";
    },

    /**
     * 每三位默认加,格式化
     * @param {number} x
     * @returns {string}
     */
    addCommas: function(x) {
        if (isNaN(x)) {
            return '-';
        }

        if (Math.abs(x) < 1000) {
            return x;
        }

        x = (x + '').split('.');
        return x[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (x.length > 1 ? ('.' + x[1]) : '');
    },
    moneyFormat: function(v, fixed) {
        v *= 1;
        if (isNaN(v)) {
            return '-';
        }
        fixed = typeof fixed !== 'undefined' && !isNaN(fixed) ? fixed : 1;

        if (v >= 10000000) { // 大于等于 1 kw
            return format.addCommas((v / 100000000).toFixed(fixed)) + '亿';
        } else {
            if (v >= 10000 || v <= -10000)
                return format.addCommas((v / 10000).toFixed(fixed)) + '万';
        }
    },
    moneyIntFormat: function(v, fixed) {
        v *= 1;
        if (isNaN(v)) {
            return '-';
        }
        fixed = typeof fixed !== 'undefined' && !isNaN(fixed) ? fixed : 1;

        if (v >= 100000000) { // 大于等于 1 kw
            return format.addCommas(Math.round((v / 100000000).toFixed(fixed))) + '亿';
        } else {
            return format.addCommas(Math.round((v / 10000).toFixed(fixed))) + '万';
        }
    },
    moneyIntFormatw: function(v, fixed) {
        v *= 1;
        if (isNaN(v)) {
            return '-';
        }
        fixed = typeof fixed !== 'undefined' && !isNaN(fixed) ? fixed : 1;
        return format.addCommas(parseFloat(v / 10000).toFixed(fixed));
    },
    myriadFormat: function(v) {
        v *= 1;
        if (isNaN(v)) {
            return '-';
        }
        if (v >= 10000) {
            return format.addCommas((v / 10000).toFixed(0)) + '万';
        } else if (v <= -10000) {
            return format.addCommas((v / 10000).toFixed(0)) + '万';
        } else {
            return format.addCommas(v.toFixed(0));
        }
    },
    myriadFormats: function(v) {
        v *= 1;
        if (isNaN(v)) {
            return '-';
        }
        if (v >= 10000) {
            return format.addCommas((v / 10000).toFixed(0));
        } else if (v <= -10000) {
            return format.addCommas((v / 10000).toFixed(0));
        } else {
            return format.addCommas(v.toFixed(0));
        }
    },
    // 针对各个图表数据格式化
    chartFormat: function(data, dataName) {
        var dataMap = ListConfig;
        var dataCompany = '';
        var name = '';
        for (var i = 0; i < dataMap.length; i++) {
            if (dataMap[i].dataName == dataName) {
                name = dataMap[i].name;
            }
        }
        if (dataName != "closing_price" && _.isArray(data) && dataName != 'turnover_rate' && dataName != 'ni_growth' && dataName != 'net_profit_rate' && dataName != 'gross_profit_rate') {
            for (var i = 0; i < data.length; i++) {
                data[i].val = numeral(data[i].val).format('0.00');
            }
        } else if ((dataName == 'pb' || dataName == 'pe') && _.isArray(data)) {
            // 市净率,市盈率 没单位，保留1位小数点
            for (var i = 0; i < data.length; i++) {
                data[i].val = isNaN(data[i].val) ? 0 : parseFloat(data[i].val).toFixed(1);
            }
        } else if (dataName == 'pb' || dataName == 'pe') {
            data = isNaN(data) ? 0 : parseFloat(data).toFixed(1);
        }
        if (dataName == 'turnover_rate' || dataName == 'ni_growth' || dataName == 'net_profit_rate' || dataName == 'gross_profit_rate') {
            if (_.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    let _n = data[i].hasOwnProperty('val') ? numeral(data[i].val).format('0.00%') : numeral(data).format('0.00%');
                    data[i].hasOwnProperty('val') ? data[i].val = _n : data[i] = _n;
                }
            }
        }
        if (dataName == 'turnover_rate' || dataName == 'revenue_growth' || dataName == 'ni_growth' || dataName == 'net_profit_rate' || dataName == 'gross_profit_rate') {
            dataCompany = '%';
        }
        return {
            data: data,
            name: name,
            dataCompany: dataCompany
        };
    },
    percent: function(number, fix) {
        return (number * 100).toFixed(fix || 1) + '%';
    },

    /**
     * 给数字增加万、亿的单位
     * @param {number} number
     * @param {?number} fix
     */
    addUnit: function(number, fix) {
        var fixNum = fix !== undefined ? fix : 1;

        if (Math.abs(number) > 100000000) {
            return (number / 100000000).toFixed(fixNum) + '亿';
        }
        if (Math.abs(number) > 10000) {
            return (number / 10000).toFixed(fixNum) + '万';
        }

        return number;
    },

    ajustFix: function (number) {
        var fix;
        number = +number;
        if (Math.abs(number) >= 10 || !number) {
            fix = 0;
        }
        else {
            fix = 1;
        }

        return number.toFixed(fix);
    },

    addYi: function(number, fix) {
        var YI = 100000000;
        if (fix !== undefined) {
            return format.addUnit(number, fix);
        } else {
            return format.ajustFix(number / YI) + '亿';
        }
    },


    addWan: function(number, fix) {
        var WAN = 10000;
        var temp;

        if (isNaN(+number)) {
            return number;
        }

        if (fix !== undefined) {
            temp = (number / WAN).toFixed(fix);
        }
        else {
            temp = format.ajustFix(number / WAN);
        }

        return format.addCommas(+temp) + '万';
    },

    ajustEmpty: function (number, isZero) {
        var result = number;
        if (isZero && !number && number !== 0) {
            result = '-';
        }

        if (!isZero && (!number || number == '0')) {
            result = '-';
        }

        return result;
    },

    cutstr: function(str, len) {
        var str_length = 0;
        var str_len = 0;
        var _str;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            _str = str.charAt(i);
            str_length++;
            if (escape(_str).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(_str);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    }
}
module.exports = format;
