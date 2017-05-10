exports.res = {
  "_stockinfogate_user_favorstock_tips": function() {
    var obj = [];
    for (var i = 0; i < 20; i++) {
      obj.push({
        category: "merger",
        amount: 1479999990.29,
        inc_stock_price: "14.03",
        date: 20160608,
        company_cnt: 2,
        is_backdoor: false,
        star: -1,
        inc_stock_num: 63292943,
        cash: 592000000,
        company_name: "百卓网络",
        title: "通鼎互联(002491)15亿收购百卓网络等公司",
        id: 705,
        url: "#/merger/705/merger",
        tag: null,
        stock_id: "002491.SZ",
        db_insert_time: 1465362125
      });
    }
    return {
      "status": true,
      "data": {
        secucode: '0000639.sz',
        "price_trigger": {
          "added_date": "20160101",
          "added_price": 10,
          "low_price": 9.2,
          "low_percent": 0.08,
          "high_price": 12.5,
          "high_percent": 0.25
        },
        "annc": obj
      }
    }
  },

  "_stockinfogate_user_favorstock_list": function() {
    return {
      "status": true,
      "data": [{
        "tags": "312",
        "secucode": "002217.SZ",
        "added_price": 15.31,
        "annc_latest3": 0,
        "secuname": "合 力 泰",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 5
      }, {
        "tags": "312",
        "secucode": "600000.SH",
        "added_price": 16.48,
        "annc_latest3": 0,
        "secuname": "浦发银行",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 1
      }, {
        "tags": "",
        "secucode": "600000.SH",
        "added_price": 16.48,
        "annc_latest3": 0,
        "secuname": "浦发银行",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 1
      }, {
        "tags": "",
        "secucode": "600000.SH",
        "added_price": 16.48,
        "annc_latest3": 0,
        "secuname": "浦发银行",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 1
      }, {
        "tags": "",
        "secucode": "600000.SH",
        "added_price": 16.48,
        "annc_latest3": 0,
        "secuname": "浦发银行",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 1
      }, {
        "tags": "",
        "secucode": "600004.SH",
        "added_price": 13.82,
        "annc_latest3": 0,
        "secuname": "白云机场",
        "added_date": 20160910,
        "annc_status": 0,
        "price_status": 0,
        "annc_count": 0
      }, {
        "tags": "",
        "secucode": "000333.SZ",
        "added_price": 27.12,
        "annc_latest3": 0,
        "secuname": "美的集团",
        "added_date": 20160910,
        "annc_status": 1,
        "price_status": 0,
        "annc_count": 2
      }]
    };
  },

  "_stockinfogate_user_favorstock_delete": function() {
    return {
      "status": true,
      "data": ""
    };
  },

  "_stockinfogate_user_favorstock_tag_add": function() {
    return {
      "status": true,
      "data": true
    };
  }
};
