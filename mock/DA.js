exports.res = {

    '_private-placement_events': function() {
        return {
            status: true,
            data: [{
                "id": 1,
                "stock_id": "000960.SZ",
                "title": "锡业股份（000960）定增26亿",
                "score": 3,
                "announcement_url": "http://www.cninfo.com.cn/cninfo-new/disclosure/szse_main/bulletin_detail/true/1202376426?announceTime=2016-06-21",
                "announcement_date": "2016-06-21",
                "has_detail": true // 是否有三级页面需要展示
            }, {
                "id": 2,
                "stock_id": "002658.SZ",
                "title": "雪迪龙(002658)定增11.8亿",
                "scores": 1,
                "announcement_url": "http://www.cninfo.com.cn/cninfo-new/disclosure/szse_sme/bulletin_detail/true/1202376227?announceTime=2016-06-21",
                "announcement_date": "2016-06-21",
                "has_detail": false
            }],
            page_num: 1,
            page_size: 15,
            total: 28
        }
    },


    '_stockinfogate_private_*': function() {
        return {
            "status": true,
            "data": {
                "id": "11",
                "stock_id": "002672.SZ",
                "title": "东江环保(002672)非公开增发20亿",
                "score": 0,
                "announcement_date": "20160715",
                "announcement_url": "http://www.cninfo.com.cn/cninfo-new/disclosure/szse/download/1202475157",
                "issue_price": 16.74,
                "price_category": 4,
                "score_A": 3,
                "score_C": 1.2,
                "score_PE": 5,
                "score_PB": 0,
                "level_a": 2,
                "level_c": 0,
                "level_pe": 1,
                "level_pb": 3,
                "score_E": 5,
                "level_e": 1,
                "score_E_source": "pe",
                "is_hot_industry": 1,
                "description": "定增20亿用于建设扩大业务规模，定增后PE为35.6倍。广东国资旗下的广晟资产全额认购，并且通过协议拥有张维仰7%的投票权，将成为公司的控股股东。",
                "issue_market": 2000000000,
                "big_shareholder_buy_ratio": 1,
                "remark": "广晟资产全额认购，将成为公司控股股东",
                "stock_name": "东江环保",
                "valuation_rating": {
                    "before": { "major_biz": "危废处理", "PE": 35.56, "PB": 5.119 },
                    "after": { "PE": 30, "PB": 3.7, "major_biz": "危废处理" }
                },
                "project_desc": [{
                    "name": "江西固废处置中心项目",
                    "invest": 496550000,
                    "period": 0,
                    "payback": 8.81,
                    "earning": 56362088.535755,
                    "inner_ratio": 0.1241
                }, { "name": "偿还银行贷款", "invest": 400000000, "period": 0, "payback": null, "earning": 20000000, "inner_ratio": null }, { "name": "潍坊工业固废资源化", "invest": 331000000, "period": 0, "payback": 8.91, "earning": 37149270.482604, "inner_ratio": 0.1195 }, { "name": "补充流动资金", "invest": 300000000, "period": 0, "payback": null, "earning": 0, "inner_ratio": null }, { "name": "沿海固废扩建工程", "invest": 148390000, "period": 0, "payback": 8.3, "earning": 17878313.253012, "inner_ratio": 0.1365 }, { "name": "衡水睿韬固废处置", "invest": 94160000, "period": 0, "payback": 7.07, "earning": 13318246.110325, "inner_ratio": 0.1217 }, { "name": "南通惠天然固废填埋场", "invest": 80400000, "period": 0, "payback": 9.67, "earning": 8314374.3536711, "inner_ratio": 0.1029 }, { "name": "东莞恒建改扩建项目", "invest": 75840000, "period": 0, "payback": 7.34, "earning": 10332425.06812, "inner_ratio": 0.1199 }, { "name": "珠海永兴盛废物焚烧处理", "invest": 73660000, "period": 0, "payback": 8.44, "earning": 8727488.1516588, "inner_ratio": 0.1265 }],
                "shares_change": {
                    "fund_raising": [{
                        "shareholder": "广晟资产",
                        "amount": 2000000000,
                        "shares": 150000000
                    }],
                    "before": [{ "shareholder": "香港中央结算", "ratio": 0.230159513912 }, { "shareholder": "张维仰", "ratio": 0.209443352447 }, { "shareholder": "广晟资产", "ratio": 0.0698000003225 }, { "shareholder": "李永鹏", "ratio": 0.0423 }, { "shareholder": "蔡虹", "ratio": 0.0219 }],
                    "after": [{ "shareholder": "广晟资产", "ratio": 0.206677035615 }, { "shareholder": "香港中央结算", "ratio": 0.196292010236 }, { "shareholder": "张维仰", "ratio": 0.178624189735 }, { "shareholder": "李永鹏", "ratio": 0.036075641158 }, { "shareholder": "蔡虹", "ratio": 0.0186774596066 }]
                }
            }
        }

    }
}
