/**
 * 对应文档中的common-api
 */

exports.res = {

    '_stockinfogate_stock_realtimeinfo': function(a) {
        var data = [];
        var temp = a.split('stockids=')[1].split('&')[0];
        var list = temp.split(',');

        for (var i = 0; i < list.length; i++) {
            data.push({
                "amount": 2254790000,
                "changeratio": -1.11581,
                "date": "2019-11-14 15:00:17",
                "turnover": 0.9052021483644102,
                "tradestatus": 1,
                "stockid": list[i],
                "floatashares": 9708107759,
                "volume": 878780,
                "origin": {
                    "lastclose": (Math.random() + 10).toFixed(2),
                    "open": 26.23,
                    "high": 26.25,
                    "low": 25.31,
                    "newprice": (Math.random() + 10).toFixed(2)
                },
                "restoration_forward": {
                    "lastclose": 25.99,
                    "open": 26.23,
                    "high": 26.25,
                    "low": 25.31,
                    "newprice": 25.7
                },
                "restoration_backward": {
                    "lastclose": 3212.55,
                    "open": 3242.21,
                    "high": 3244.68,
                    "low": 3128.49,
                    "newprice": 3176.7
                }
            })
        }
        return {
            "status": true,
            "data": data
        }
    },

    '_stockinfogate_indexqt_realtimeinfo': function() {
        return {
            "status": true,
            "data": [{
                "amount": 148870000000,
                "open": 3115.9,
                "changeratio": -0.870091,
                "date": "2016-12-20 14:37:13",
                "lastclose": 3118.08,
                "volume": 137055000,
                "high": 3117.01,
                "newprice": 3090.95,
                "indexid": "000001.SH",
                "low": 3084.8
            }, {
                "amount": 187011000000,
                "open": 10275.4,
                "changeratio": -0.577448,
                "date": "2016-12-20 14:37:15",
                "lastclose": 10283.2,
                "volume": 133548000,
                "high": 10276.6,
                "newprice": 10223.8,
                "indexid": "399001.SZ",
                "low": 10204
            }, {
                "amount": 77888400000,
                "open": 6513.75,
                "changeratio": -0.450105,
                "date": "2016-12-20 14:37:15",
                "lastclose": 6514.1,
                "volume": 51732800,
                "high": 6517.44,
                "newprice": 6484.78,
                "indexid": "399005.SZ",
                "low": 6472.09
            }, {
                "amount": 44450400000,
                "open": 1981.69,
                "changeratio": -0.0787745,
                "date": "2016-12-20 14:37:15",
                "lastclose": 1980.41,
                "volume": 20110600,
                "high": 1989.99,
                "newprice": 1978.85,
                "indexid": "399006.SZ",
                "low": 1974.93
            }]
        };
    }

}
