exports.res = {
  '_self-stock_list': function() {
    return ({
      "self_stocks": [{
        "id": "1",
        "user_id": "788",
        "stock_id": "603029.sh",
        "db_insert_time": "1402349203",
        "db_delete_time": "-1",
        "top_flag": "0",
        "top_time": "0"
      }, {
        "id": "2",
        "user_id": "788",
        "stock_id": "600003.sh",
        "db_insert_time": "1463991081",
        "db_delete_time": "-1",
        "top_flag": "0",
        "top_time": "0"
      }, {
        "id": "3",
        "user_id": "788",
        "stock_id": "600094.sh",
        "db_insert_time": "1463991192",
        "db_delete_time": "-1",
        "top_flag": "0",
        "top_time": "0"
      }, {
        "id": "4",
        "user_id": "788",
        "stock_id": "600021.sh",
        "db_insert_time": "1463991269",
        "db_delete_time": "-1",
        "top_flag": "0",
        "top_time": "0"
      }]
    })
  },

  '_self-stock_create': function() {
    return ({
      "first_creation": "false",
      "status": "true",
    })
  },

  '_daily-stock_show': function() {
    return {
      "stock_id": "002217.SZ",
      "stock_name": "合 力 泰",
      "date": "20160602",
      "tags": "智能穿戴;触摸屏模板",
      "img_url": "static/daily_stock_image/智能穿戴.png",
      "reason_html": "<span style=\"font-family:Microsoft YaHei;color:#999999;\"><span style=\"font-size:14px;\">合力泰原来是做化工的公司，2015年收购了比亚迪电子部品件，业际光电和平波电子100%股权后，并且剥离联合丰元及新泰联合两个化工子公司后主营业务变成了<strong>触摸屏模组，液晶显示模组和摄像头模组</strong>等。因为2015年下半年合并报表，所以2016年上半年预计净利润同比2015年增长超过200%，达到3亿元。现在PE80倍，根据业绩增长预测全年6亿净利润，年底PE将降到30倍左右。且公司在概念上享有<strong>智能穿戴</strong>的概念，是目前比较火热的发展方向。</span></span>",
      "ups": "10",
      "downs": "3",
      "addition_close_price": 16.6,
      "last_close_price": 15.31,
      "user": {
        "up": false,
        "down": false
      },
      "next": {},
      "prev": {
        "date": "20160601",
        "stock_id": "600755.SH",
        "stock_name": "厦门国贸"
      }
    };
  },

  '_stock_info': function() {
    return ({
      "status": "true",
      "stocks_name": {
        "002284.sz": "亚太股份",
        "000002.sz": "万科A",
        "600006.sh": "东风汽车",
        "002308.sz": "威创股份",
        "000581.sz": "威孚高科",
        "002707.sz": "众信旅游",
        "000031.sz": "中粮地产"
      },
      "stocks_addition_date": {
        "002284.sz": "20160708",
        "000002.sz": "20160708",
        "600006.sh": "20160707",
        "002308.sz": "20160630",
        "000581.sz": "20160630",
        "002707.sz": "20160629",
        "000031.sz": "20160629"
      },
      "stocks_tag": {
        "002284.sz": [],
        "000002.sz": [{
          "tag": "万科复牌"
        }, {
          "tag": "王石之争"
        }],
        "600006.sh": [{
          "tag": "忘记手动阀"
        }],
        "002308.sz": [{
          "tag": "水淀粉"
        }],
        "000581.sz": [{
          "tag": "欧文分数"
        }],
        "002707.sz": [],
        "000031.sz": []
      },
      "stocks_real_price": {
        "002284.sz": "18.72",
        "000002.sz": "18.06",
        "600006.sh": "8.69",
        "002308.sz": "16.37",
        "000581.sz": "20.72",
        "002707.sz": "21.84",
        "000031.sz": "9.76"
      },
      "stocks_latest_price": {
        "002284.sz": {
          "002284.sz": "18.9"
        },
        "000002.sz": {
          "000002.sz": "18.27"
        },
        "600006.sh": {
          "600006.sh": "8.85"
        },
        "002308.sz": {
          "002308.sz": "16.37"
        },
        "000581.sz": {
          "000581.sz": "20.68"
        },
        "002707.sz": {
          "002707.sz": "21.39"
        },
        "000031.sz": {
          "000031.sz": "9.78"
        }
      },
      "stocks_latest_price_from_addtion": {
        "002284.sz": {
          "002284.sz": "19.18"
        },
        "000002.sz": {
          "000002.sz": "18.75"
        },
        "600006.sh": {
          "600006.sh": "9.2"
        },
        "002308.sz": {
          "002308.sz": "16.43"
        },
        "000581.sz": {
          "000581.sz": "20.16"
        },
        "002707.sz": {
          "002707.sz": "20.64"
        },
        "000031.sz": {
          "000031.sz": "9.48"
        }
      }
    })
  },

}
