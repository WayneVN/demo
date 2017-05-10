exports.res = {
    '_stockinfogate_announcement_query': function() {
        var announcements = [];

        for (var i = 0; i < 10; i++) {
            var temp = {
                "name": "2016/07/22",
                "type": "star/date",
                "data": []
            };

            for (var k = 0; k < 10; k++) {
                temp.data.push({
                    "date": "2016-08-08",
                    "category": ["merger", 'private', 'internal'][k % 3],
                    "isNew": true,
                    "title": "华菱钢铁（000932）185.9亿收购财富投资",
                    "url": "/merger/002070.SZ/936/insider",
                    "star": 1.5,
                    "stockStatus": [null, 'suspended', 'limitUp', 'limitDown'][k % 4],
                    "tag": "中国制造是",
                    "stock_id": '000001.sz',
                    id: i * 10 + k
                })
            }

            announcements.push(temp);
        }
        return {
            "status": true,
            "data": {
                "count": {
                    "全部": 1367,
                    "并购重组": {
                        "全部": 643,
                        "借壳上市": 57,
                        "全现金": 91,
                        "发行股份": 552
                    },
                    "定向增发": {
                        "全部": 21,
                        "大股东认购": 10,
                        "大股东不认购": 11
                    },
                    "内部交易": {
                        "全部": 703,
                        "大股东增持": 294,
                        "高管增持": 54,
                        "公司回购": 9,
                        "员工激励": 164,
                        "减持": 182
                    }
                },
                announcementsAllCnt: 2323,
                "announcements": announcements
            }
        }
    }
}
