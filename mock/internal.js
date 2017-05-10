exports.res = {

    '_stockinfogate_internal_*': function() {

        var subItem = [];

        for (var i = 0; i < 10; i++) {
            subItem.push({
                event_id: i,
                "trade_start_date": "20160401", //事件起始时间
                "trade_end_date": "20161001", //事件结束时间
                "publish_date": "20160501", //公告发布时间
                "stockholders_meeting_date": "20160501", //股东大会日
                "event_type": "0", //事件类型 2:大股东增持, 6:大股东减持, 4:高管增持, 7:高管减持, 3:公司回购, 0:限制性股票激励, 1:股票期权激励, 5:员工持股计划'
                "people_num": "0", //人数
                "amount": "0", //金额
                "share_ratio": ["0.000000002", '0.02'][i % 2], //占股比
                "cost": "0", //成本
                "progress": "0.3", //计划完成度
                "announcement_url": "http://xxx",
                "status": 2, //事件状态: 1. 计划，2. 完成，3. 进展
                "buy_back_price": "12.1", //目标回购价格, 仅回购类型用字段
                "increase_ratio": "0.4", //解锁业绩增速,仅员工激励类型用字段
            });
        }

        return {
            status: true,
            data: {
                "stock_name": "雅戈尔",
                "stock_id": "000002.SZ",
                "event": {
                    "id": 2,
                    "name": "雅戈尔(600177)大股东均价15.13增持4,842万元，占股比0.14%",
                    "announcement_url": "http://xxx.com/xxxx",
                    "price": 15.13,
                    "publish_date": '20160801',
                    lock: 1,
                    "event_type": "2", //事件类型 2:大股东增持, 6:大股东减持, 4:高管增持, 7:高管减持, 3:公司回购, 0:限制性股票激励, 1:股票期权激励, 5:员工持股计划'
                    "price_category": 1 //(1: 定价, 2: 估价, 3: 计划)
                },
                "status_map":{"1":"计划","2":"进展","3":"结束"},
                "serial_events": {
                    "description": "xx<span>xx</span>",
                    "score": 0,
                    "score_price": 3,
                    "score_amount": 3,
                    "score_ratio": 1,
                    "level_price": 3,
                    "score_peg": 1,
                    "level_peg": 3,
                    "level_amount": 3,
                    "level_ratio": 1,
                    parent_item: {
                        amount_origin: "200000000",
                        share_ratio_origin: '0',
                        "trade_start_date": "20160401", //事件起始时间
                        "trade_end_date": "20161001", //事件结束时间
                        "publish_date": "20160501", //公告发布时间
                        "stockholders_meeting_date": "20160501", //股东大会日
                        "people_num": "0", //人数
                        "amount": "12345", //金额
                        "share_ratio": "0.0000063", //占股比
                        "cost": "12.2", //成本
                        "progress": "3", //计划完成度
                        "announcment_url": "http://xxx",
                        "status": "3", //事件状态: 1. 计划，2. 完成，3. 进展
                        "buy_back_price": "12.1", //目标回购价格, 仅回购类型用字段
                        "increase_ratio": "0.4", //解锁业绩增速,仅员工激励类型用字段
                        "is_thistime": 0,

                    },
                    plan_item: {
                        amount_origin: "200000000",
                        share_ratio_origin: '0',
                        "trade_start_date": "20160401", //事件起始时间
                        "trade_end_date": "20161001", //事件结束时间
                        "publish_date": "20160501", //公告发布时间
                        "stockholders_meeting_date": "20160501", //股东大会日
                        "people_num": "0", //人数
                        "amount": "12345", //金额
                        "share_ratio": "0.0000063", //占股比
                        "cost": "12.2", //成本
                        "progress": "3", //计划完成度
                        "announcment_url": "http://xxx",
                        "status": "3", //事件状态: 1. 计划，2. 完成，3. 进展
                        "buy_back_price": "12.1", //目标回购价格, 仅回购类型用字段
                        "increase_ratio": "0.4", //解锁业绩增速,仅员工激励类型用字段
                        "is_thistime": 0,

                    },
                    sub_item: subItem,
                    "unlock": [{
                        "performance": [ //营业收入
                            { "year": "2013", "value": "600000", "role": "base" }, //role:base 基准年数据
                            { "year": "2014", "value": "700000", "role": "base" },
                            { "year": "2015", "value": "850000", "role": "commitment" }, //role:commitment 解锁承诺
                            { "year": "2015", "value": "800000", "role": "real" }, //role:real 实际业绩
                            { "year": "2016", "value": "1000000", "role": "commitment" }, //role:real 实际业绩
                        ],
                        "gr": "0.2", // 净利润/营业收入 复合预期增速
                        "pe": 24.8,
                        "peg": 80,
                        "ratio_calc_year": ["2016", "2018"],
                        "ratio_calc_value": ["2500000000", "5000000000"],
                        market_value: 29710078409,
                        "value_type": "net_income", // net_income: 净利润, revenue: 营业收入
                    }, {
                        "performance": [ //营业收入
                            { "year": "2013", "value": "600000", "role": "base" }, //role:base 基准年数据
                            { "year": "2014", "value": "700000", "role": "base" },
                            { "year": "2015", "value": "850000", "role": "commitment" }, //role:commitment 解锁承诺
                            { "year": "2015", "value": "800000", "role": "real" }, //role:real 实际业绩
                            { "year": "2016", "value": "1000000", "role": "commitment" }, //role:real 实际业绩
                            { "year": "2017", "value": "1000000", "role": "commitment" }, //role:real 实际业绩
                        ],
                        "gr": "0.2", // 净利润/营业收入 复合预期增速
                        "pe": 24.8,
                        "peg": 80,
                        "ratio_calc_year": ["2016", "2018"],
                        "ratio_calc_value": ["2500000000", "5000000000"],
                        market_value: 29710078409,
                        "value_type": "revenue", // net_income: 净利润, revenue: 营业收入
                    }, ]

                },
            }
        }
    },


}
